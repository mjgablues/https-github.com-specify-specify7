'use strict';

require('../css/workbench.css');

const $ = require('jquery');
const Backbone = require('./backbone.js');
const Q = require('q');
const Handsontable = require('handsontable').default;
const Papa = require('papaparse');

require('handsontable/dist/handsontable.full.css');

const schema = require('./schema.js');
const api = require('./specifyapi.js');
const app = require('./specifyapp.js');
const userInfo = require('./userinfo.js');
const DataSetMeta = require('./datasetmeta.js').default;
const navigation = require('./navigation.js');
const NotFoundView = require('./notfoundview.js');
const WBUploadedView = require('./components/wbuploadedview').default;
const WBStatus = require('./wbstatus.js');
const WBUtils = require('./wbutils.js');
const {
  getIndexFromReferenceItemName,
  valueIsReferenceItem,
  valueIsTreeRank,
} = require('./wbplanviewmodelhelper');
const {
  mappingsTreeToArrayOfSplitMappings,
} = require('./wbplanviewtreehelper.ts');
const { uploadPlanToMappingsTree } = require('./uploadplantomappingstree.ts');
const { extractDefaultValues } = require('./wbplanviewhelper.ts');
const { getMappingLineData } = require('./wbplanviewnavigator.ts');
const fetchDataModelPromise = require('./wbplanviewmodelfetcher.ts').default;
const { capitalize } = require('./wbplanviewhelper.ts');
const icons = require('./icons.js');
const formatObj = require('./dataobjformatters.js').format;
const template = require('./templates/wbview.html');

const WBView = Backbone.View.extend({
  __name__: 'WbForm',
  className: 'wbs-form',
  events: {
    'click .wb-upload': 'upload',
    'click .wb-validate': 'chooseValidationMode',
    'click .wb-plan': 'openPlan',
    // TODO: remove the Show Plan button
    'click .wb-show-plan': 'showPlan',
    'click .wb-save': 'saveClicked',

    'click .wb-show-upload-view': 'displayUploadedView',
    'click .wb-unupload': 'unupload',
  },
  initialize({ dataset, refreshInitiatedBy }) {
    this.dataset = dataset;
    this.mappedHeaders = {};
    this.data = dataset.rows;
    if (this.data.length < 1) {
      this.data.push(Array(this.dataset.columns.length).fill(null));
    }

    this.mappings =
      this.dataset.uploadplan &&
      uploadPlanToMappingsTree(this.dataset.columns, this.dataset.uploadplan);

    this.validationMode = this.dataset.rowresults == null ? 'off' : 'static';
    this.liveValidationStack = [];
    this.liveValidationActive = false;

    this.wbutils = new WBUtils({
      wbview: this,
      el: this.el,
    });

    this.uploaded =
      this.dataset.uploadresult !== null && this.dataset.uploadresult.success;
    this.uploadedView = undefined;
    this.refreshInitiatedBy = refreshInitiatedBy;
    this.rowResults = this.dataset.rowresults
      ? this.dataset.rowresults.slice()
      : [];

    this.resize = this.resize.bind(this);
  },
  render() {
    this.$el.append(
      template({
        is_uploaded: this.uploaded,
        has_rowresults: this.dataset.rowresults !== null,
        is_manager: userInfo.usertype === 'Manager',
      })
    );

    new DataSetMeta({
      dataset: this.dataset,
      el: this.$('.wb-name'),
      handleDelete: this.delete.bind(this),
      handleExport: this.export.bind(this),
    }).render();

    if (this.dataset.uploaderstatus) this.openStatus();

    if (!this.dataset.uploadplan)
      $(
        '<div>No plan has been defined for this dataset. Create one now?</div>'
      ).dialog({
        title: 'No Plan is defined',
        modal: true,
        buttons: {
          Create: this.openPlan.bind(this),
          Cancel: function () {
            $(this).dialog('close');
          },
        },
      });

    this.initHot().then(() => {
      this.dataset.rowresults && this.getValidationResults();
      fetchDataModelPromise().then(this.identifyMappedHeaders.bind(this));
      this.wbutils.findLocalityColumns();
      this.resize();
    });

    this.updateValidationButton();
    if (this.validationMode === 'static') {
      this.el.classList.remove('wb-hide-invalid-cells');
      this.el.classList.add('wb-hide-new-cells');
    }

    // Calling resize here minimizes layout shift
    this.resize();

    $(window).on('resize', this.resize);
    return this;
  },
  initHot() {
    return new Promise((resolve) =>
      setTimeout(() => {
        this.hot = new Handsontable(this.$('.wb-spreadsheet')[0], {
          // initial height gets overwritten on page's load
          height: 500,
          data: this.data,
          cells: this.defineCell.bind(this, this.dataset.columns.length),
          columns: this.dataset.columns.map((__, i) => ({ data: i })),
          colHeaders: (col) => `<div class="wb-header-${col} ${
            this.dataset.columns[col] in this.mappedHeaders
              ? ''
              : 'wb-header-unmapped'
          }">
            ${
              this.dataset.columns[col] in this.mappedHeaders
                ? `<img
                    class="wb-header-icon"
                    alt="${
                      this.mappedHeaders[this.dataset.columns[col]].split(
                        '.'
                      )?.[1] || ''
                    }"
                    src="${this.mappedHeaders[this.dataset.columns[col]]}"
                  >`
                : ''
            }
            <span class="wb-header-name columnSorting">
                ${this.dataset.columns[col]}
            </span>
          </div>`,
          hiddenColumns: {
            // hide the disambiguation column
            columns: [this.dataset.columns.length],
            indicators: false,
          },
          minSpareRows: 1,
          comments: true,
          rowHeaders: true,
          manualColumnResize: true,
          manualColumnMove: this.dataset.visualorder ?? true,
          outsideClickDeselects: false,
          columnSorting: true,
          sortIndicator: true,
          search: {
            searchResultClass: 'wb-search-match-cell',
          },
          contextMenu: {
            items: this.uploaded
              ? {}
              : {
                  row_above: 'row_above',
                  row_below: 'row_below',
                  remove_row: 'remove_row',
                  separator_1: '---------',
                  fill_down: this.wbutils.fillCellsContextMenuItem(
                    'Fill Down',
                    this.wbutils.fillDown
                  ),
                  fill_up: this.wbutils.fillCellsContextMenuItem(
                    'Fill Up',
                    this.wbutils.fillUp
                  ),
                  separator_2: '---------',
                  disambiguate: {
                    name: 'Disambiguate',
                    disabled: () => !this.isAmbiguousCell(),
                    callback: (__, selection) =>
                      this.disambiguateCell(selection),
                  },
                  undo: 'undo',
                  redo: 'redo',
                },
          },
          licenseKey: 'non-commercial-and-evaluation',
          stretchH: 'all',
          readOnly: this.uploaded,
          beforeColumnMove: this.beforeColumnMove.bind(this),
          afterColumnMove: this.columnMoved.bind(this),
          afterCreateRow: this.rowCreated.bind(this),
          afterRemoveRow: this.rowRemoved.bind(this),
          afterChange: this.afterChange.bind(this),
        });
        resolve();
      }, 0)
    );
  },
  remove() {
    this.hot.destroy();
    $(window).off('resize', this.resize);
  },
  isAmbiguousCell() {
    const [[row, col]] = this.hot.getSelected();
    if (this.mappings) {
      const targetHeader = this.dataset.columns[this.hot.toPhysicalColumn(col)];
      const mappingPath = mappingsTreeToArrayOfSplitMappings(
        this.mappings.mappingsTree
      ).find(({ headerName }) => headerName === targetHeader)?.mappingPath;
      const rowResult = this.rowResults[this.hot.toPhysicalRow(row)];
      return typeof rowResult === 'undefined' ||
        typeof mappingPath === 'undefined'
        ? false
        : getRecordResult(rowResult, mappingPath)?.MatchedMultiple != null;
    }
    return false;
  },
  clearDisambiguation(row) {
    const ncols = this.dataset.columns.length;
    const rn = this.hot.toPhysicalRow(row);
    const hidden = this.data[rn][ncols];
    const extra = hidden ? JSON.parse(hidden) : {};
    extra.disambiguation = {};
    this.data[rn][ncols] = JSON.stringify(extra);
  },
  setDisambiguation(row, mapping, id) {
    const ncols = this.dataset.columns.length;
    const rn = this.hot.toPhysicalRow(row);
    const hidden = this.data[rn][ncols];
    const extra = hidden ? JSON.parse(hidden) : {};
    const da = extra.disambiguation || {};
    da[mapping.slice(0, -1).join(' ')] = id;
    extra.disambiguation = da;
    this.data[rn][ncols] = JSON.stringify(extra);
    this.spreadSheetChanged();
  },
  disambiguateCell([
    {
      start: { row, col },
    },
  ]) {
    if (this.mappings) {
      const targetHeader = this.dataset.columns[this.hot.toPhysicalColumn(col)];
      const mappingPath = mappingsTreeToArrayOfSplitMappings(
        this.mappings.mappingsTree
      ).find(({ headerName }) => headerName === targetHeader)?.mappingPath;
      const tableName = getMappingLineData({
        baseTableName: this.mappings.baseTableName,
        mappingPath: mappingPath.slice(0, -1),
      })[0]?.tableName;
      const model = schema.getModel(tableName);
      const rowResult = this.rowResults[this.hot.toPhysicalRow(row)];
      const matches = getRecordResult(rowResult, mappingPath).MatchedMultiple;
      const resources = new model.LazyCollection({
        filters: { id__in: matches.ids.join(',') },
      });

      const doDA = (selected) => {
        this.setDisambiguation(row, mappingPath, parseInt(selected, 10));
        this.startValidateRow(row);
      };
      const doAll = (selected) => {
        // loop backwards so the live validation will go from top to bottom
        for (let i = this.data.length - 1; i >= 0; i--) {
          const rowResult = this.rowResults[this.hot.toPhysicalRow(i)];
          const key =
            rowResult &&
            getRecordResult(rowResult, mappingPath)?.MatchedMultiple?.key;
          if (key === matches.key) {
            this.setDisambiguation(i, mappingPath, parseInt(selected, 10));
            this.startValidateRow(i);
          }
        }
      };

      const table = $('<table>');
      resources.fetch({ limit: 0 }).done(() => {
        if (resources.length < 1) {
          $(`<div>None of the matched records currently exist in the database.
This can happen if all of the matching records were deleted since the validation process occurred,
or if all of the matches were ambiguous with respect other records in this data set. In the latter case,
you will need to add fields and values to the data set to resolve the ambiguity.</div>`).dialog(
            {
              title: 'Disambiguate',
              modal: true,
              close() {
                $(this).remove();
              },
              buttons: [
                {
                  text: 'Close',
                  click() {
                    $(this).dialog('close');
                  },
                },
              ],
            }
          );
          return;
        }

        resources.forEach((resource, i) => {
          const tr = $(
            `<tr><td><input type="radio" class="da-option" name="disambiguate" value="${resource.id}" id="da-option-${i}"></td></tr>`
          ).appendTo(table);
          tr.append(
            $('<td>').append(
              $(`<a target="_blank">ℹ️</a>`).attr('href', resource.viewUrl())
            )
          );
          const label = $(`<label for="da-option-${i}">`).text(resource.id);
          tr.append($('<td>').append(label));
          formatObj(resource).done((formatted) => label.text(formatted));
        });

        const applyToAll = $(
          '<label>Use this selection for all matching disambiguous records </label>'
        ).append('<input type="checkbox" class="da-use-for-all" value="yes">');

        $('<div>')
          .append(table)
          .append(applyToAll)
          .dialog({
            title: 'Disambiguate',
            modal: true,
            close() {
              $(this).remove();
            },
            buttons: [
              {
                text: 'Select',
                click() {
                  const selected = $('input.da-option:checked', this).val();
                  const useForAll = $(
                    'input.da-use-for-all:checked',
                    this
                  ).val();
                  if (selected != null) {
                    (useForAll ? doAll : doDA)(selected);
                    $(this).dialog('close');
                  }
                },
              },
              {
                text: 'Cancel',
                click() {
                  $(this).dialog('close');
                },
              },
            ],
          });
      });
    }
  },
  afterChange(changes, source) {
    if (
      ![
        'edit',
        'CopyPaste.paste',
        'Autofill.fill',
        'UndoRedo.undo',
        'UndoRedo.redo',
      ].includes(source)
    )
      return;

    const cols = this.dataset.columns.length;
    changes.forEach(([row, col]) => {
      this.clearDisambiguation(row);
      this.wbutils.initCellInfo(row, col);
      this.wbutils.cellInfo[row * cols + col].isModified = true;
    });

    this.updateCellInfos();
    this.spreadSheetChanged();

    if (this.dataset.uploadplan && changes) {
      changes
        .filter(
          (
            [, column] // ignore changes to unmapped columns
          ) =>
            Object.keys(this.mappedHeaders).indexOf(
              this.dataset.columns[this.hot.toPhysicalColumn(column)]
            ) !== -1
        )
        .forEach(([row]) => this.startValidateRow(row));
    }
  },
  rowCreated(index, amount, source) {
    if (!this.hot) return;

    const cols = this.dataset.columns.length;
    this.wbutils.cellInfo = this.wbutils.cellInfo
      .slice(0, index * cols)
      .concat(
        new Array(amount * cols),
        this.wbutils.cellInfo.slice(index * cols)
      );
    this.hot.render();

    if (source !== 'auto') this.spreadSheetChanged();
  },
  rowRemoved(index, amount, source) {
    if (!this.hot) return;

    const cols = this.dataset.columns.length;
    this.wbutils.cellInfo = this.wbutils.cellInfo
      .slice(0, index * cols)
      .concat(this.wbutils.cellInfo.slice((index + amount) * cols));
    this.hot.render();
    if (this.hot.countRows() === 0) {
      this.hot.alter('insert_row', 0);
    }

    if (source !== 'auto') this.spreadSheetChanged();
  },
  beforeColumnMove: (_columnIndexes, _startPosition, endPosition) =>
    typeof endPosition !== 'undefined',
  columnMoved(_columnIndexes, _startPosition, endPosition) {
    if (typeof endPosition === 'undefined' || !this.hot) return;

    const columnOrder = [];
    for (let i = 0; i < this.dataset.columns.length; i++) {
      columnOrder.push(this.hot.toPhysicalColumn(i));
    }
    if (
      this.dataset.visualorder == null ||
      columnOrder.some((i, j) => i !== this.dataset.visualorder[j])
    ) {
      this.dataset.visualorder = columnOrder;
      $.ajax(`/api/workbench/dataset/${this.dataset.id}/`, {
        type: 'PUT',
        data: JSON.stringify({ visualorder: columnOrder }),
        dataType: 'json',
        processData: false,
      }).fail(this.checkDeletedFail.bind(this));
    }
  },
  identifyMappedHeaders() {
    const stylesContainer = document.createElement('style');
    const unmappedCellStyles = '{ color: #999; }';

    if (!this.mappings) return;
    const arrayOfMappings =
      this.mappings &&
      mappingsTreeToArrayOfSplitMappings(this.mappings.mappingsTree);

    const mappedHeadersAndTables = Object.fromEntries(
      arrayOfMappings.map(({ mappingPath, headerName }) => [
        headerName,
        icons.getIcon(
          getMappingLineData({
            baseTableName: this.mappings.baseTableName,
            mappingPath: mappingPath.slice(0, -1),
          })[0]?.tableName || ''
        ),
      ])
    );

    this.mappedHeaders = mappedHeadersAndTables;

    Object.values(
      this.el
        .getElementsByClassName('wtSpreader')[0]
        ?.getElementsByClassName('colHeader')
    ).forEach((headerContainer) => {
      const header = headerContainer.children[0];
      let headerId = header?.className.match(/wb-header-(\d+)/)?.[1];

      if (!headerId) return;

      headerId = parseInt(headerId);

      const src = this.mappedHeaders[headerId];

      if (typeof src !== 'string') return;

      const img = document.createElement('img');
      img.classList.add('wb-header-icon');
      img.setAttribute('src', src);
      img.setAttribute(
        'alt',
        src.split('/').slice(-1)?.[0]?.split('.')?.[0] || src
      );
    });

    stylesContainer.innerHTML = `${Object.entries(this.dataset.columns)
      .filter(([, columnName]) => !(columnName in mappedHeadersAndTables))
      .map(([index]) => `.wb-col-${index} ${unmappedCellStyles}`)
      .join('\n')}`;

    const defaultValues = Object.fromEntries(
      Object.entries(
        typeof arrayOfMappings === 'undefined'
          ? {}
          : extractDefaultValues(arrayOfMappings, true)
      ).map(([headerName, defaultValue]) => [
        this.dataset.columns.indexOf(headerName),
        defaultValue,
      ])
    );

    this.hot.updateSettings({
      columns: (index) =>
        typeof defaultValues[index] === 'undefined'
          ? {}
          : { placeholder: defaultValues[index] },
    });

    this.$el.append(stylesContainer);
  },
  displayUploadedView() {
    if (!this.dataset.rowresults) return;

    const uploadView = this.$el.find('.wb-upload-view')[0];

    if (typeof this.uploadedView !== 'undefined') return;

    uploadView.innerHTML = '<div></div>';
    const container = uploadView.children[0];

    this.uploadedView = new WBUploadedView({
      dataset: this.dataset,
      hot: this.hot,
      el: container,
      removeCallback: () => (this.uploadedView = undefined),
    }).render();
  },
  unupload() {
    if (typeof this.uploadedView !== 'undefined') {
      this.uploadedView.remove();
      this.uploadedView = undefined;
    }
    $.post(`/api/workbench/unupload/${this.dataset.id}/`);
    this.openStatus('unupload');
  },
  updateCellInfos(showValidationSummary = false) {
    const cellCounts = {
      newCells: this.wbutils.cellInfo.reduce(
        (count, info) => count + (info.isNew ? 1 : 0),
        0
      ),
      invalidCells: this.wbutils.cellInfo.reduce(
        (count, info) => count + (info.issues.length ? 1 : 0),
        0
      ),
      searchResults: this.wbutils.cellInfo.reduce(
        (count, info) => count + (info.matchesSearch ? 1 : 0),
        0
      ),
      modifiedCells: this.wbutils.cellInfo.reduce(
        (count, info) => count + (info.isModified ? 1 : 0),
        0
      ),
    };

    //update navigation information
    Object.values(
      this.el.getElementsByClassName('wb-navigation-total')
    ).forEach((navigationTotalElement) => {
      const navigationContainer = navigationTotalElement.closest(
        '.wb-navigation-section'
      );
      const navigationType = navigationContainer.getAttribute(
        'data-navigation-type'
      );
      navigationTotalElement.innerText = cellCounts[navigationType];

      if (cellCounts[navigationType] === 0) {
        const currentPositionElement = navigationContainer.getElementsByClassName(
          'wb-navigation-position'
        )?.[0];
        if (currentPositionElement !== 'undefined')
          currentPositionElement.innerText = 0;
      }
    });

    const refreshInitiatedBy = showValidationSummary
      ? 'validation'
      : this.refreshInitiatedBy;

    const messages = {
      validation:
        cellCounts.invalidCells === 0
          ? {
              title: 'Validation successful',
              message: 'Validation completed successfully!',
            }
          : {
              title: 'Validation Failed',
              message: `Some issues were detected.<br>
                    Please fix them before uploading the dataset.`,
            },
      upload:
        cellCounts.invalidCells === 0
          ? {
              title: 'Upload completed',
              message: `You can open the 'View' menu to see a detailed
                        breakdown of the upload results.`,
            }
          : {
              title: 'Upload failed due to validation errors',
              message: `Upload failed with ${cellCounts.invalidCells}
                        invalid cells.<br>
                        Please review the validation messages and repeat
                        the upload process.`,
            },
      unupload: {
        title: 'Unupload completed',
        message: 'Unupload completed successfully.',
      },
    };

    if (refreshInitiatedBy in messages) {
      const dialog = $(`<div>
                ${messages[refreshInitiatedBy].message}
            </div>`).dialog({
        title: messages[refreshInitiatedBy].title,
        modal: true,
        buttons: {
          Close() {
            $(this).dialog('destroy');
          },
          ...(this.refreshInitiatedBy === 'upload' &&
          cellCounts.invalidCells === 0
            ? {
                'View upload results': () => {
                  this.displayUploadedView();
                  dialog.dialog('close');
                },
              }
            : {}),
        },
      });

      this.refreshInitiatedBy = undefined;
    }

    this.hot.render();
  },
  triggerLiveValidation() {
    const pumpValidation = () => {
      this.updateValidationButton();
      if (this.liveValidationStack.length === 0) {
        this.liveValidationActive = false;
        return;
      }
      this.liveValidationActive = true;
      const row = this.liveValidationStack.pop();
      const rowData = this.hot.getSourceDataAtRow(row);
      Q(
        $.post(
          `/api/workbench/validate_row/${this.dataset.id}/`,
          JSON.stringify(rowData)
        )
      )
        .then((result) =>
          this.gotRowValidationResult(this.hot.toVisualRow(row), result)
        )
        .fin(pumpValidation);
    };

    if (!this.liveValidationActive) {
      pumpValidation();
    }
  },
  startValidateRow(row) {
    if (this.validationMode === 'live') {
      this.liveValidationStack = this.liveValidationStack
        .filter((r) => r !== row)
        .concat(this.hot.toPhysicalRow(row));
      this.triggerLiveValidation();
    }
  },
  gotRowValidationResult(row, result) {
    if (this.validationMode === 'live') {
      this.rowResults[this.hot.toPhysicalRow(row)] = result.result;
      this.parseRowValidationResult(row, result.validation, true);
      this.updateCellInfos();
    }
  },
  chooseValidationMode() {
    const dl = $('<dl>');
    if (this.dataset.uploadplan == null) {
      dl.append('<dt>Live</dt>');
      dl.append(`<dd>Rows are validated independently from one another and in response to changes.
Requires an <a href="/specify/workbench-plan/${this.dataset.id}/">upload plan</a> to be defined.</dd>`);

      dl.append('<dt>Static</dt>');
      dl.append(`<dd>Row validation highlighting is based on the last trial upload and does not respond to changes.
Requires an <a href="/specify/workbench-plan/${this.dataset.id}/">upload plan</a> to be defined.</dd>`);
    } else {
      dl.append(
        `<dt><label><input type="radio" name="validation-mode" value="live" ${
          this.validationMode === 'live' ? 'checked' : ''
        }> Live</label></dt>`
      );
      dl.append(
        '<dd>Rows are validated independently from one another and in response to changes.</dd>'
      );

      if (this.dataset.rowresults == null) {
        dl.append('<dt>Static</dt>');
        dl.append(`<dd>Row validation highlighting is based on the last trial upload and does not respond to changes.
Only available after a trial upload is completed.</dd>`);
      } else {
        dl.append(
          `<dt><label><input type="radio" name="validation-mode" value="static" ${
            this.validationMode === 'static' ? 'checked' : ''
          }> Static</label></dt>`
        );
        dl.append(
          '<dd>Row validation highlighting is based on the last trial upload and does not respond to changes.</dd>'
        );
      }
    }

    dl.append(
      `<dt><label><input type="radio" name="validation-mode" value="off" ${
        this.validationMode === 'off' ? 'checked' : ''
      }> Off</label></dt>`
    );
    dl.append('<dd>Row validation highlighting is disabled.</dd>');

    const dialog = $('<div>')
      .append(dl)
      .dialog({
        title: 'Validation Mode',
        width: 360,
        modal: true,
        close() {
          $(this).remove();
        },
        buttons: {
          Select() {
            const choice = $('input:checked', this).val();
            selected(choice);
            $(this).dialog('close');
          },
          Cancel() {
            $(this).dialog('close');
          },
        },
      });
    const selected = (choice) => {
      if (!['live', 'static', 'off'].includes(choice)) {
        return;
      }
      this.validationMode = choice;
      switch (this.validationMode) {
        case 'live':
          this.liveValidationStack = this.dataset.rows
            .map((__, i) => i)
            .reverse();
          this.triggerLiveValidation();
          this.el.classList.remove(
            'wb-hide-new-cells',
            'wb-hide-invalid-cells'
          );
          break;
        case 'static':
          this.getValidationResults();
          this.el.classList.remove('wb-hide-invalid-cells');
          this.el.classList.add('wb-hide-new-cells');
        case 'off':
          this.liveValidationStack = [];
          this.liveValidationActive = false;
          break;
      }
      this.updateValidationButton();
      this.wbutils.cellInfo = [];
      this.updateCellInfos();
      this.hot.render();
    };
  },
  updateValidationButton() {
    switch (this.validationMode) {
      case 'live':
        const n = this.liveValidationStack.length;
        this.$('.wb-validate').text(
          'Validation: Live' + (n > 0 ? ` (${n})` : '')
        );
        break;
      case 'static':
        this.$('.wb-validate').text('Validation: Static');
        break;
      case 'off':
        this.$('.wb-validate').text('Validation: Off');
        break;
    }
  },
  getValidationResults(showValidationSummary = false) {
    Q($.get(`/api/workbench/validation_results/${this.dataset.id}/`)).done(
      (results) => {
        this.wbutils.cellInfo = [];

        if (results == null) {
          this.validationMode = 'off';
          this.updateValidationButton();
          this.hot.render();
          return;
        }

        results.forEach((result, row) => {
          this.parseRowValidationResult(row, result, false);
        });

        this.updateCellInfos(showValidationSummary);
      }
    );
  },
  parseRowValidationResult(row, result, isLive) {
    const cols = this.dataset.columns.length;
    const headerToCol = {};
    for (let i = 0; i < cols; i++) {
      headerToCol[this.dataset.columns[i]] = i;
    }

    for (let i = 0; i < cols; i++) {
      delete this.wbutils.cellInfo[row * cols + i];
    }

    const addErrorMessage = (columnName, issue) => {
      const col = headerToCol[columnName];
      this.wbutils.initCellInfo(row, col);
      const cellInfo = this.wbutils.cellInfo[row * cols + col];

      cellInfo.issues.push(capitalize(issue));

      // In CSS, modified cells have higher priority then invalid cells
      // Here, we need to overwrite that manually when live validation
      // detected some issues
      if (isLive) cellInfo.isModified = false;
    };

    if (result === null) return;

    result.tableIssues.forEach((tableIssue) =>
      (tableIssue.columns.length === 0
        ? this.dataset.columns
        : tableIssue.columns
      ).forEach((columnName) => addErrorMessage(columnName, tableIssue.issue))
    );

    result.cellIssues.forEach((cellIssue) =>
      addErrorMessage(cellIssue.column, cellIssue.issue)
    );

    result.newRows.forEach(({ columns }) =>
      columns.forEach((columnName) => {
        const col = headerToCol[columnName];
        this.wbutils.initCellInfo(row, col);
        const cellInfo = this.wbutils.cellInfo[row * cols + col];
        cellInfo.isNew = true;
      })
    );
  },
  defineCell(cols, row, col, prop) {
    let cellData;
    try {
      cellData = this.wbutils.cellInfo[row * cols + col];
    } catch (e) {}

    return {
      comment: cellData && {
        value: cellData.issues.join('<br>'),
        readOnly: true,
      },
      renderer: function (instance, td, row, col, prop, value, cellProperties) {
        if (cellData && cellData.isNew) td.classList.add('wb-no-match-cell');

        if (cellData && cellData.isModified)
          td.classList.add('wb-modified-cell');

        if (cellData && cellData.issues.length)
          td.classList.add('wb-invalid-cell');

        td.classList.add(`wb-col-${col}`);

        Handsontable.renderers.TextRenderer.apply(null, arguments);
      },
    };
  },
  openPlan() {
    navigation.go(`/workbench-plan/${this.dataset.id}/`);
  },
  showPlan() {
    const dataset = this.dataset;
    const $this = this;
    const planJson = JSON.stringify(dataset.uploadplan, null, 4);
    $('<div>')
      .append($('<textarea cols="120" rows="50">').text(planJson))
      .dialog({
        title: 'Upload plan',
        width: 'auto',
        modal: true,
        close() {
          $(this).remove();
        },
        buttons: {
          Save() {
            dataset.uploadplan = JSON.parse($('textarea', this).val());
            $.ajax(`/api/workbench/dataset/${dataset.id}/`, {
              type: 'PUT',
              data: JSON.stringify({ uploadplan: dataset.uploadplan }),
              dataType: 'json',
              processData: false,
            }).fail(this.checkDeletedFail.bind(this));
            $(this).dialog('close');
            $this.trigger('refresh');
          },
          Close() {
            $(this).dialog('close');
          },
        },
      });
  },
  spreadSheetChanged() {
    this.$('.wb-upload')
      .prop('disabled', true)
      .prop('title', 'You should save your changes before Uploading');
    this.$('.wb-save').prop('disabled', false);
    navigation.addUnloadProtect(this, 'The workbench has not been saved.');
  },
  resize: function () {
    // Height of the page - content offset - bottom margin
    this.el.style.height = `${$(window).height() - this.el.offsetTop - 15}px`;
    if (!this.hot) return;
    this.hot.updateSettings({
      height: this.$el.find('.wb-spreadsheet').height(),
    });
    return true;
  },
  saveClicked: function () {
    this.save().done();
  },
  save: function () {
    // clear validation
    this.wbutils.cellInfo = [];
    this.dataset.rowresults = null;
    if (this.validationMode === 'static') {
      this.validationMode = 'off';
      this.updateValidationButton();
    }
    this.updateCellInfos();

    //show saving progress bar
    const dialog = $('<div><div class="progress-bar"></div></div>').dialog({
      title: 'Saving',
      modal: true,
      open(evt, ui) {
        $('.ui-dialog-titlebar-close', ui.dialog).hide();
      },
      close() {
        $(this).remove();
      },
    });
    $('.progress-bar', dialog).progressbar({ value: false });

    //send data
    return Q(
      $.ajax(`/api/workbench/rows/${this.dataset.id}/`, {
        data: JSON.stringify(this.data),
        error: this.checkDeletedFail.bind(this),
        type: 'PUT',
      })
    )
      .then(() => {
        this.spreadSheetUpToDate();
      })
      .finally(() => dialog.dialog('close'));
  },
  checkDeletedFail(jqxhr) {
    if (jqxhr.status === 404) {
      this.$el.empty().append('Dataset was deleted by another session.');
      jqxhr.errorHandled = true;
    }
  },
  spreadSheetUpToDate: function () {
    this.$('.wb-upload').prop('disabled', false).prop('title', '');
    this.$('.wb-save').prop('disabled', true);
    navigation.removeUnloadProtect(this);
  },
  upload(evt) {
    const mode = $(evt.currentTarget).is('.wb-upload') ? 'upload' : 'validate';
    const openPlan = () => this.openPlan();
    if (this.dataset.uploadplan) {
      const start = (mode) => {
        this.liveValidationStack = [];
        this.liveValidationActive = false;
        this.validationMode = 'off';
        this.updateValidationButton();
        $.post(`/api/workbench/${mode}/${this.dataset.id}/`)
          .fail((jqxhr) => {
            this.checkDeletedFail(jqxhr);
          })
          .done(() => {
            this.openStatus(mode);
          });
      };
      $(
        '<div>The upload process will transfer the data set data into the main ' +
          'Specify tables. Performing a trial upload is recommended because ' +
          'it can detect some issues that live validation cannot.</div>'
      ).dialog({
        title: 'Upload',
        modal: true,
        buttons: [
          {
            text: 'Upload',
            click: function () {
              start('upload');
            },
          },
          {
            text: 'Trial Upload',
            click: function () {
              start('validate');
            },
          },
          {
            text: 'Cancel',
            click: function () {
              $(this).dialog('close');
            },
          },
        ],
      });
    } else {
      $(
        '<div>No plan has been defined for this dataset. Create one now?</div>'
      ).dialog({
        title: 'No Plan is defined',
        modal: true,
        buttons: {
          Cancel: function () {
            $(this).dialog('close');
          },
          Create: openPlan,
        },
      });
    }
  },
  openStatus(mode) {
    new WBStatus({ dataset: this.dataset })
      .render()
      .on('done', () => this.trigger('refresh', mode));
  },
  delete: function () {
    let dialog;
    const doDelete = () => {
      $.ajax(`/api/workbench/dataset/${this.dataset.id}/`, { type: 'DELETE' })
        .done(() => {
          this.$el.empty().append('<p>Dataset deleted.</p>');
          dialog.dialog('close');
        })
        .fail((jqxhr) => {
          this.checkDeletedFail(jqxhr);
          dialog.dialog('close');
        });
    };

    dialog = $('<div>Really delete?</div>').dialog({
      modal: true,
      title: 'Confirm delete',
      close() {
        $(this).remove();
      },
      buttons: {
        Delete: doDelete,
        Cancel: function () {
          $(this).dialog('close');
        },
      },
    });
  },
  export() {
    const data = Papa.unparse({
      fields: this.dataset.columns,
      data: this.dataset.rows,
    });
    const wbname = this.dataset.name;
    const filename = wbname.match(/\.csv$/) ? wbname : wbname + '.csv';
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.setAttribute('download', filename);
    a.click();
  },
});

module.exports = function loadDataset(id, refreshInitiatedBy = undefined) {
  const dialog = $('<div><div class="progress-bar"></div></div>').dialog({
    title: 'Loading',
    modal: true,
    open(evt, ui) {
      $('.ui-dialog-titlebar-close', ui.dialog).hide();
    },
    close() {
      $(this).remove();
    },
  });
  $('.progress-bar', dialog).progressbar({ value: false });

  $.get(`/api/workbench/dataset/${id}/`)
    .done((dataset) => {
      dialog.dialog('close');

      const view = new WBView({
        dataset,
        refreshInitiatedBy,
      }).on('refresh', (mode) => loadDataset(id, mode));
      app.setCurrentView(view);
    })
    .fail((jqXHR) => {
      if (jqXHR.status === 404) {
        jqXHR.errorHandled = true;
        app.setCurrentView(new NotFoundView());
        app.setTitle('Page Not Found');
        return '(not found)';
      }
      return jqXHR;
    });
};

function getRecordResult({ UploadResult }, mappingPath) {
  if (mappingPath.length <= 1 || valueIsTreeRank(mappingPath[0])) {
    return UploadResult.record_result;
  } else if (valueIsReferenceItem(mappingPath[1])) {
    const idx = getIndexFromReferenceItemName(mappingPath[1]);
    const toMany = UploadResult.toMany[mappingPath[0]];
    const next = toMany && toMany[idx - 1];
    return next && getRecordResult(next, mappingPath.slice(2));
  } else {
    const next = UploadResult.toOne[mappingPath[0]];
    return next && getRecordResult(next, mappingPath.slice(1));
  }
}
