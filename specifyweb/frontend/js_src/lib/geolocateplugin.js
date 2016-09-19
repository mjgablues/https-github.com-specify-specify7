"use strict";

const $ = require('jquery');
const _ = require('underscore');
const Q = require('q');

const UIPlugin = require('./uiplugin.js');
const querystring = require('./querystring.js');
const schema = require('./schema.js');

module.exports =  UIPlugin.extend({
    __name__: "GeoLocatePlugin",
    events: {
        'click': 'click'
    },
    render: function() {
        if (this.model.specifyModel.name !== "Locality") {
            throw new Error("geolocateplugin can only be used with locality resources");
        }
        this.$el.attr('value', 'GEOLocate');
        return this;
    },
    click: function(evt) {
        evt.preventDefault();
        this.geoRefData().done(function(data) {
            data ? this.openGeoLocate(data) : this.geoRequired();
        }.bind(this));
    },
    geoRequired: function() {
        $('<div title="Geography Required">' +
          '<p><span class="ui-icon ui-icon-alert" style="display: inline-block;"></span>' +
          'The GeoLocate plugin requires the geography field to be populated.</p></div>'
         ).dialog({close: function(){ $(this).remove(); }});
    },
    openGeoLocate: function(data) {
        const url = querystring.param("//www.museum.tulane.edu/geolocate/web/webgeoreflight.aspx", data)
                  .replace(/%7c/gi, '|'); // GEOLocate doesn't like '|' to be uri escaped.

        var listener = function(evt) {
            if (evt.origin === "http://www.museum.tulane.edu")
                this.gotGeoRef(evt.data);
        }.bind(this);

        window.addEventListener('message', listener, false);

        $('<div id="geolocate-dialog">')
            .append($('<iframe>', {src: url, style: "width:908px; height:653px;"}))
            .dialog({
                width: 'auto',
                resizable: false,
                title: 'GEOLocate',
                close: function() {
                    window.removeEventListener('message', listener, false);
                    $(this).remove();
                }
            });
    },
    gotGeoRef: function(dataStr) {
        const [lat, long, uncertainty, poly] = dataStr.split('|');

        this.model.set({
            lat1text: lat,
            latitude1: parseFloat(lat),
            long1text: long,
            longitude1: parseFloat(long),
            latlongtype: "Point",
            latlongmethod: "GEOLocate" // Presumably available in picklist.
        });

        const uncertaintyParsed = uncertainty === 'Unavailable' ? null : parseFloat(uncertainty);
        const polyParsed = poly === 'Unavailable' ? null : poly;

        if (uncertaintyParsed != null || polyParsed != null) {
            this.model.rget('geocoorddetails').done(gcd => {
                if (gcd == null) {
                    gcd = new schema.models.GeoCoordDetail.Resource();
                    gcd.placeInSameHierarchy(this.model);
                    this.model.set('geocoorddetails', gcd);
                }
                gcd.set({
                    maxuncertaintyest: uncertaintyParsed,
                    maxuncertaintyestunit: uncertaintyParsed && "m",
                    errorpolygon: polyParsed
                });
            });
        }

        $('#geolocate-dialog').dialog('close');
    },
    geoRefData: function() {
        const currentLat = this.model.get('latitude1');
        const currentLon = this.model.get('longitude1');
        const name = this.model.get('localityname');

        const point = (currentLat != null && currentLon != null) ? [currentLat, currentLon, name, ''] : null;

        const constructGeo = (geography, result) => Q
                  .all([geography.rget('parent', true), geography.rget('definitionitem', true)])
                  .spread((parent, geodef) => {
                      const level = geodef.get('name').toLowerCase();
                      if (['country', 'state', 'county'].includes(level)) {
                          result[level] = geography.get('name');
                      }
                      return parent == null ? result : constructGeo(parent, result);
                  });

        const uncertainty = point == null ? null : Q(this.model.rget('geocoorddetails', true))
                  .then(gcd => gcd == null ? '' : gcd.get('maxuncertaintyest'));

        const geography =  Q(this.model.rget('geography', true))
                  .then(geo => geo == null ? null : constructGeo(geo, {}));

        return Q.all([geography, uncertainty])
            .spread((geo, uncert) => {
                if (geo == null) return null;

                const data = Object.assign({
                    v: 1,
                    w: 900,
                    h: 400,
                    georef: 'run',
                    locality: this.model.get('localityname'),
                    tab: 'results'
                }, geo);

                if (point != null) {
                    data.points = [...point, uncert].map(v => v.toString().replace(/[|:]/g, ' ')).join('|');
                }
                return data;
            });
    }
}, { pluginsProvided: ['LocalityGeoRef'] });

