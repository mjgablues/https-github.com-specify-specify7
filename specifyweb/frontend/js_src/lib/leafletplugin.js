'use strict';

const $ = require('jquery');

const LocalityRecordDataExtractor = require('./localityrecorddataextractor.ts');
const Leaflet = require('./leaflet.ts');
const UIPlugin = require('./uiplugin.js');
const localityText = require('./localization/locality.tsx').default;
const commonText = require('./localization/common.tsx').default;

module.exports = UIPlugin.extend(
  {
    __name__: 'GoogleMapsPlugin',
    events: {
      click: 'click',
    },
    render() {
      this.$el.attr('value', localityText('showMap')).prop('disabled', false);
      return this;
    },
    click(event_) {
      event_.preventDefault();

      const lat = this.model.get('latitude1');
      const long = this.model.get('longitude1');

      if (lat == undefined || long == undefined)
        return $(`<div>
        ${localityText('notEnoughInformationToMap')}
      </div>`).dialog({
          title: localityText('noCoordinates'),
          close() {
            $(this).remove();
          },
          buttons: {
            [commonText('close')]() {
              $(this).remove();
            },
          },
        });

      let fullLocalityData = undefined;

      LocalityRecordDataExtractor.getLocalityDataFromLocalityResource(
        this.model,
        true
      ).then((localityData) =>
        Leaflet.showLeafletMap({
          localityPoints: [localityData],
          leafletMapContainer: 'leaflet-plugin',
          markerClickCallback: (_, { target: marker }) =>
            (typeof fullLocalityData === 'undefined'
              ? LocalityRecordDataExtractor.getLocalityDataFromLocalityResource(
                  this.model
                )
              : Promise.resolve(fullLocalityData)
            ).then((localityData) => {
              fullLocalityData = localityData;
              marker
                .getPopup()
                .setContent(Leaflet.formatLocalityData(localityData));
            }),
        })
      );
    },
  },
  { pluginsProvided: ['LocalityGoogleEarth'] }
);
