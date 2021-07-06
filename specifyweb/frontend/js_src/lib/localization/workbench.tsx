import React from 'react';

import { createDictionary, createHeader, createJsxHeader } from './utils';

// Refer to "Guidelines for Programmers" in ./utils.tsx before editing this file

const wbText = createDictionary({
  // Buttons
  rollback: 'Roll back',
  validate: 'Validate',
  validation: 'Validation',
  upload: 'Upload',
  results: 'Results',
  disambiguate: 'Disambiguate',
  fillDown: 'Fill Down',
  fillUp: 'Fill Up',
  revert: 'Revert',
  geoLocate: 'GeoLocate',
  geoMap: 'GeoMap',
  uploadPlan: 'Upload Plan',
  dataCheck: 'Data Check',
  dataCheckOn: (queueLength: number) =>
    `Data Check: On ${queueLength > 0 ? ` (${queueLength})` : ''}`,
  changeOwner: 'Change Owner',
  export: 'Export',
  convertCoordinates: 'Convert Coordinates',
  searchResults: 'Search Results',
  modifiedCells: 'Modified Cells',
  newCells: 'New Cells',
  errorCells: 'Error Cells',

  // Dialogs
  dataSetLoadingDialogTitle: 'Loading',
  noUploadPlanDialogTitle: 'Upload Plan Status',
  noUploadPlanDialogHeader: createHeader('No Upload Plan is Defined'),
  noUploadPlanDialogMessage:
    'No Upload Plan has been defined for this Data Set. Create one now?',
  noDisambiguationResultsDialogTitle: 'Disambiguate',
  noDisambiguationResultsDialogHeader: createHeader(''),
  noDisambiguationResultsDialogMessage: `
    None of the matched records currently exist in the database.
    This can happen if all of the matching records were deleted since the
    validation process occurred, or if all of the matches were ambiguous
    with respect other records in this data set. In the latter case, you
    will need to add fields and values to the data set to resolve the
    ambiguity.`,
  disambiguationDialogTitle: 'Disambiguate Multiple Record Matches',
  applyAllUnavailable: `
    "Apply All" is not available while Data Check is in progress.`,
  rollbackDialogTitle: 'Data Set Roll Back',
  rollbackDialogHeader: createHeader(''),
  rollbackDialogMessage: `
    Rolling back will remove the new data records this Data Set added to the
    Specify database. The entire rollback will be cancelled if any of the
    uploaded data have been referenced (re-used) by other data records in the
    database since they were uploaded.`,
  startUploadDialogTitle: 'Data Set Upload',
  startUploadDialogHeader: createHeader(''),
  startUploadDialogMessage: `
    Start the Upload? Uploading the Data Set will add the data to the Specify
    database.`,
  deleteDataSetDialogTitle: 'Delete Data Set',
  deleteDataSetDialogHeader: createHeader('Delete this Data Set?'),
  deleteDataSetDialogMessage: `
    Deleting a Data Set permanently removes it and its Upload Plan.
    Data mappings will no longer be available for re-use with other
    Data Sets. Also after deleting, Rollback will no longer be an option for
    an uploaded Data Set.`,
  dataSetDeletedTitle: 'Delete Data Set',
  dataSetDeletedHeader: createHeader(''),
  dataSetDeletedMessage: 'Data Set successfully deleted.',
  revertChangesDialogTitle: `
    Reverting Unsaved Changes`,
  revertChangesDialogHeader: createHeader(''),
  revertChangesDialogMessage: `
    Revert Changes? This action will discard all changes to the Data Set since
    the last save.`,
  savingDialogTitle: 'Saving',
  onExitDialogMessage: 'Changes to this Data Set have not been saved.',

  // Validation
  picklistValidationFailed: (value: string) =>
    [
      `${value ? `"${value}"` : ''} is not a legal value in this picklist `,
      'field. Click on the arrow to choose among available options.',
    ].join(''),
  noMatchErrorMessage: 'No matching record for must-match table.',
  matchedMultipleErrorMessage: [
    'This value matches two or more existing database records and must ',
    'be manually disambiguated before uploading.',
  ].join(''),
  validationNoErrorsDialogTitle: 'Validation Completed with No Errors',
  validationNoErrorsDialogHeader: createHeader(''),
  validationNoErrorsDialogMessage: `
    Validation found no errors in the Data Set. It is
    ready to be uploaded into the database.<br><br>

    Cell validations and their highlighting will
    remain with the Data Set until it is edited and
    re-saved. If any cells are edited, Validation should
    be re-run as the last step prior to uploading
    to confirm that no errors have been introduced.`,
  validationErrorsDialogTitle: 'Validation Completed with Errors',
  validationErrorsDialogHeader: createHeader(''),
  validationErrorsDialogMessage: `
    Validation found errors in some cell values in this Data Set.<br><br>

    If any cells are edited and the Data Set re-saved,
    Validation should always be re-run as the last step
    prior to uploading to confirm that no errors have
    been introduced.`,
  uploadNoErrorsDialogTitle: 'Upload Completed with No Errors',
  uploadNoErrorsDialogHeader: createHeader(''),
  uploadNoErrorsDialogMessage: `
    Click on the "Results" button above to see values for new records
    added to each database table.`,
  uploadErrorsDialogTitle: 'Upload Failed due to Validation Errors',
  uploadErrorsDialogHeader: createHeader(''),
  uploadErrorsDialogMessage: `
    The Data Set upload failed due to one or more cell value errors.<br><br>

    Run "Data Check" or "Validate" again, review the
    mouseover hints for each error cell, and make the
    appropriate corrections. Save changes and retry the
    Upload.`,
  dataSetRollbackDialogTitle: 'Data Set Rollback',
  dataSetRollbackDialogHeader: createHeader(''),
  dataSetRollbackDialogMessage: 'Data Set was rolled back successfully.',
  validationCanceledDialogTitle: 'Validation Process Status',
  validationCanceledDialogHeader: createHeader(''),
  validationCanceledDialogMessage: 'Validation cancelled.',
  rollbackCanceledDialogTitle: 'Rollback Process Status',
  rollbackCanceledDialogHeader: createHeader(''),
  rollbackCanceledDialogMessage: 'Rollback cancelled.',
  uploadCanceledDialogTitle: 'Upload Process Status',
  uploadCanceledDialogHeader: createHeader(''),
  uploadCanceledDialogMessage: 'Upload cancelled.',
  geoLocateDialogTitle: 'GeoLocate',
  coordinateConverterDialogTitle: 'Change Geocoordinate Format',
  coordinateConverterDialogHeader: createHeader(''),

  // Misc
  wbUploadedUnavailable: 'The data set must be validated or uploaded',
  wbValidateUnavailable:
    'Please define an Upload Plan before Validating the Data Set',
  unavailableWhileEditing: 'This action requires all changes to be saved.',
  unavailableWhileViewingResults:
    'This action is unavailable while viewing the upload results',
  unavailableWhileValidating:
    'This action is unavailable while Data Check is in progress',
  unavailableWithoutLocality:
    'This tool requires locality columns to be mapped',
  unavailableWhenUploaded: 'This tool does not work with uploaded Data Sets',
  dataSetDeletedOrNotFound: 'Data Set was deleted by another session.',
  includeDmsSymbols: 'Include DMS Symbols',

  // WbUploaded
  uploadResults: 'Upload Results',
  potentialUploadResults: 'Potential Upload Results',
  wbUploadedDescription: 'The number of new records created in each table:',
  wbUploadedPotentialDescription:
    'The number of new records that would be created in each table:',

  // WbAdvancedSearch
  wbAdvancedSearchDialogTitle: 'Configure Search & Replace',
  navigationOptions: 'Navigation Options',
  cursorPriority: 'Cursor Priority',
  columnFirst: 'Column first',
  rowFirst: 'Row first',
  searchOptions: 'Search Options',
  findEntireCellsOnly: 'Find entire cells only',
  matchCase: 'Match case',
  useRegularExpression: 'Use regular expression',
  liveUpdate: 'Live update',
  replaceOptions: 'Replace Options',
  replaceMode: 'Replace Mode',
  replaceAll: 'Replace all matches',
  replaceNext: 'Replace next occurrence',

  // WbImport
  importDataSet: 'Import Data Set',
  wbImportHeader: 'Import File to Create a New Data Set',
  previewDataSet: 'Preview Dataset',
  corruptFile: (fileName: string) =>
    `The file ${fileName} is corrupt or contains no data!`,
  characterEncoding: 'Character encoding:',
  filePickerMessage: 'Choose a file or drag it here',
  selectedFileName: (fileName: string) => `Selected file: ${fileName}`,
  chooseDataSetName: 'Name for New Data Set:',
  firstRowIsHeader: 'First Row is Header:',
  importFile: 'Import file',
  columnName: (columnIndex: number) => `Column ${columnIndex}`,

  // WbPlanView
  ignoreWhenBlank: 'Ignore when Blank',
  ignoreWhenBlankDescription: [
    'When set to "Ignore when Blank" blank ',
    'values in this column will not be ',
    'considered for matching purposes. Blank ',
    'values are ignored when matching even if a ',
    'default value is provided',
  ].join(''),
  ignoreAlways: 'Always ignore',
  ignoreAlwaysDescription: [
    'When set to ignoreAlways the value in ',
    'this column will never be considered for ',
    'matching purposes, only for uploading.',
  ].join(''),
  ignoreNever: 'Never ignore',
  ignoreNeverDescription: [
    'This column would always be considered ',
    "for matching purposes, regardless of it's ",
    'value',
  ].join(''),
  allowNullValues: 'Allow Null values',
  useDefaultValue: 'Use default value',
  useDefaultValueDescription:
    'This value would be used in place of empty cells',
  addNewColumn: 'Add New Column',
  revealHiddenFormFields: 'Reveal Hidden Form Fields',
  validationFailedDialogTitle: 'Upload Plan Mapping',
  validationFailedDialogHeader: createJsxHeader(''),
  validationFailedDialogMessage: `
    This data mapping is missing one or more data fields required for
    uploading by your Specify configuration. Add the missing mappings
    shown or save this Upload Plan as unfinished.`,
  continueEditing: 'Continue Editing',
  saveUnfinished: 'Save Unfinished',
  map: 'Map',
  selectBaseTable: 'Select a Base Table',
  chooseExistingPlan: 'Choose Existing Plan',
  showAdvancedTables: 'Show Advanced Tables',
  dataSetUploaded: 'Data Set uploaded. This Upload Plan cannot be changed',
  dataSetUploadedDescription: [
    'You are viewing the mappings for an uploaded dataset.\n',
    'To edit the mappings, rollback the upload or create a new ',
    'dataset',
  ].join(''),
  baseTable: 'Base Table',
  goToBaseTableDialogTitle:
    'Change the Base Table for Mapping Data Set Columns',
  goToBaseTableDialogHeader: createJsxHeader(''),
  goToBaseTableDialogMessage: `
    Choosing a different Base Table for a Data Set Upload will make that
    table the new starting point for column-to-data field mappings and
    will erase existing mappings. The Automapper will attempt to map
    columns to the new Base Table fields.`,
  changeBaseTable: 'Change Base Table',
  reRunAutoMapper: 'Rerun Automapper',
  autoMapper: 'Automapper',
  hideMappingEditor: 'Hide Mapping Editor',
  showMappingEditor: 'Show Mapping Editor',
  matchingLogic: 'Matching Logic',
  clearMappings: 'Clear Mappings',
  validateMappings: 'Validate Mappings',
  validated: 'Validated!',
  emptyDataSetDialogTitle: 'Empty Data Set detected',
  emptyDataSetDialogHeader: createJsxHeader(''),
  emptyDataSetDialogMessage: (
    <>
      This Data Set doesn&apos;t have any columns.
      <br />
      Press the &quot;Add New Column&quot; button at the bottom of the screen to
      add new columns,
    </>
  ),
  reRunAutoMapperDialogTitle: 'Automapper',
  reRunAutoMapperDialogHeader: createJsxHeader(
    'Automap to start a new Upload Plan?'
  ),
  reRunAutoMapperDialogMessage: 'This will erase existing data field mappings.',
  nothingToValidateDialogTitle: 'Nothing to validate',
  nothingToValidateDialogHeader: createJsxHeader(''),
  nothingToValidateDialogMessage:
    'Please map some headers before running the validation.',
  matchingLogicDialogTitle: 'Change Matching Logic',
  matchingLogicDialogMessage: 'Require Data to Match Existing Records',
  matchingLogicUnavailableDialogMessage:
    'Matching logic is unavailable for current mappings',
  mustMatch: 'Must Match',
  unloadProtectMessage: 'This mapping has not been saved.',
  newDataSetName: (date: string): string => `New Data Set ${date}`,
  newHeaderName: (index: number): string => `New Column ${index}`,
  noHeader: '(no header)',

  // WbsDialog
  wbsDialogDefaultDialogTitle: (dataSetCount: number) =>
    `Data Sets (${dataSetCount})`,
  wbsDialogEmptyDefaultDialogMessage: 'Currently no Data Sets exist.',
  wbsDialogTemplatesDialogTitle: 'Copy plan from existing Data Set',
  wbsDialogEmptyTemplateDialogMessage:
    'There are no plans available, please continue to create an upload plan.',
  createDataSetInstructions: `
    Use "Import a file" or "Create New" to make a new one.`,
  createNew: 'Create New',

  // DataSetMeta
  dataSetMetaDialogTitle: 'Data Set Properties',
  dataSetMetaDialogHeader: createHeader(''),
  dataSetName: 'Data Set Name:',
  remarks: 'Remarks:',
  metadata: 'Metadata:',
  numberOfRows: 'Number of rows',
  numberOfColumns: 'Number of columns',
  created: 'Created:',
  modified: 'Modified:',
  uploaded: 'Uploaded:',
  importedFileName: 'Imported file name:',
  noFileName: '(no file name)',
  changeDataSetOwnerDialogTitle: 'Change Data Set Owner',
  changeDataSetOwnerDialogHeader: createHeader(''),
  changeDataSetOwnerDialogMessage: 'Select New Owner:',
  dataSetOwnerChangedDialogTitle: 'Data Set owner changed',
  dataSetOwnerChangedDialogHeader: createHeader(''),
  dataSetOwnerChangedDialogMessage: 'Data Set owner changed',
  dataSet: 'Data Set:',
  dataSetUploadedLabel: '(Uploaded, Read-Only)',

  // WbStatus
  wbStatusUnuploadDialogTitle: 'Data Set Rollback Status',
  wbStatusUploadDialogTitle: 'Data Set Upload Status',
  wbStatusValidationDialogTitle: 'Data Set Validation Status',
  aborting: 'Aborting...',
  wbStatusAbortFailed: (operationName: string) =>
    `Failed aborting ${operationName}. Please try again later`,
  wbStatusOperationNoProgress: (operationName: string) => `${operationName}...`,
  wbStatusOperationProgress: (
    operationName: string,
    current: number,
    total: number
  ) => `${operationName} Row: ${current}/${total}`,
  wbStatusPendingDialogMessage: function wbStatusPendingDialogMessage(
    operationName: string
  ) {
    return (
      <>
        {operationName} of this Data Set should begin shortly.
        <br />
        <br />
        If this message persists for longer than 30 seconds, the {
          operationName
        }{' '}
        process is busy with another Data Set. Specify currently supports only
        one {operationName} process at a time for a Specify 7 installation.
        Please try again later.
      </>
    );
  },
  wbStatusErrorDialogMessage: function wbStatusPendingDialogMessage(
    operationName: string,
    errorMessage: string
  ) {
    return (
      <>
        Error occurred during {operationName}:
        <br />
        <br />
        {errorMessage}
      </>
    );
  },
  updatingTrees: 'Updating trees...',
});

export default wbText;
