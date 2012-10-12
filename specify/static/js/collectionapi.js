define([
    'jquery', 'underscore', 'backbone', 'resourceapi', 'schema', 'whenall', 'jquery-bbq'
], function($, _, Backbone, api, schema, whenAll) {

    api.Collection = Backbone.Collection.extend({
        populated: false,   // set if the collection has been fetched or filled in
        dependent: false,   // set when the collection is related to a parent resource by a dependent field

        initialize: function(models) {
            this.queryParams = {}; // these define the filters on the collection
            if (models) this.populated = true;
            this.on('add remove', function() {
                this.trigger('saverequired');
            }, this);
        },
        url: function() {
            return '/api/specify/' + this.model.specifyModel.name.toLowerCase() + '/';
        },
        parse: function(resp, xhr) {
            _.extend(this, {
                populated: true,   // have data now
                limit: resp.meta.limit,
                totalCount: resp.meta.total_count,
            });
            return resp.objects;
        },
        fetchIfNotPopulated: function () {
            var collection = this;
            // a new collection is used for to-many collections related to new resources
            if (this.isNew) return $.when(collection);
            if (this._fetch) return this._fetch.pipe(function () { return collection; });

            return this.populated ? $.when(collection) : this.fetch().pipe(function () { return collection; });
        },
        fetch: function(options) {
            var self = this;
            // block trying to fetch data for collections that represent new to-many collections
            if (self.isNew) {
                throw new Error("can't fetch non-existant collection");
            }

            if (self._fetch) throw new Error('already fetching');

            options = options || {};
            options.add = true;
            options.silent = true;
            options.at = _.isUndefined(options.at) ? self.length : options.at;
            options.data = options.data || _.extend({}, self.queryParams);
            options.data.offset = options.at;
            if (_(self).has('limit')) options.data.limit = self.limit;
            self._fetch = Backbone.Collection.prototype.fetch.call(self, options);
            return self._fetch.then(function() { self._fetch = null; });
        },
        abortFetch: function() {
            if (!this._fetch) return;
            this._fetch.abort();
            this._fetch = null;
        },
        add: function(models, options) {
            options = options || {};
            options.at = _.isUndefined(options.at) ? this.length : options.at;
            models = _.isArray(models) ? models.slice() : [models];
            if (this.totalCount) {
                if (this.models.length < this.totalCount) this.models[this.totalCount-1] = undefined;
                this.models.splice(options.at, models.length);
                this.length = this.models.length;
            }
            return Backbone.Collection.prototype.add.apply(this, arguments);
        },
        rsave: function() {
            return whenAll(_.chain(this.models).compact().invoke('rsave').value());
        },
        gatherDependentFields: function() {
            this.invoke('gatherDependentFields');
        },
        getTotalCount: function() {
            var self = this;
            if (self.isNew) return $.when(self.length);
            if (self._fetch) return self._fetch.pipe(function() { return self.totalCount; });
            return self.fetchIfNotPopulated().pipe(function() { return self.totalCount; });
        }
    }, {
        forModel: function(model) {
            model = _(model).isString() ? schema.getModel(model) : model;
            if (!_(collections).has(model.name)) {
                collections[model.name] = api.Collection.extend({
                    model: api.Resource.forModel(model)
                });
            }
            return collections[model.name];
        },
        fromUri: function(uri) {
            var match = /api\/specify\/(\w+)\//.exec(uri);
            var collection = new (api.Collection.forModel(match[1]))();
            if (uri.indexOf("?") !== -1)
                _.extend(collection.queryParams, $.deparam.querystring(uri));
            return collection;
        }
    });

    var RecordSetItems = api.Collection.extend({
        initialize: function() {
            this.model = api.Resource.forModel('recordsetitem');
            return this.constructor.__super__.initialize.apply(this, arguments);
        },
        fetch: function(options) {
            options = options || {};
            options.itemFetchDeferreds = [];
            var mainFetch = api.Collection.prototype.fetch.call(this, options);
            var comprehensiveFetch = mainFetch.pipe(function() {
                return whenAll(options.itemFetchDeferreds);
            });
            comprehensiveFetch.abort = function() { return mainFetch.abort(arguments); };
            return comprehensiveFetch;
        },
        add: function(models, options) {
            api.Collection.prototype.add.call(this, models, options);
            var ItemResource = api.Resource.forModel(
                schema.getModelById(this.parent.get('dbTableId'))
            );
            var recordSetItems = this;
            _(models).forEach(function(model) {
                var recordSetItem = recordSetItems.get(model.id);
                var item = new ItemResource({ id: recordSetItem.get('recordId') });
                recordSetItem.item = item;
                options.itemFetchDeferreds.push(item.fetch());
            });
            return this;
        },
        at: function(index) {
            var recordSetItem = api.Collection.prototype.at.call(this, index);
            return recordSetItem && recordSetItem.item;
        }
    });

    var collections = {
        RecordSetItem: RecordSetItems
    };

    return api;
});
