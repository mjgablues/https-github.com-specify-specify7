import { createDictionary } from './utils';

// Refer to "Guidelines for Programmers" in ./README.md before editing this file

const lifemapperText = createDictionary({
  specifyNetwork: 'Specify Network',
  speciesDistributionMap: 'Species Distribution Map',
  markerLayerLabel: 'Your Database Pins',
  polygonLayerLabel: 'Your Database Polygons',
  polygonBoundaryLayerLabel: 'Your Database Polygon Boundaries',
  leafletDetailsHeader: 'Legend',
  leafletDetailsErrorsHeader: 'Lifemapper:',
  gbif: 'GBIF:',
  projectionNotFound: 'No Distribution Model available.',
  modelCreationData: 'Model Created:',
  projection: 'Lifemapper Distribution Model',
  occurrencePoints: 'GBIF Occurrence Points',
  overLimitMessage: (limit: number) =>
    `Only the first ${limit} specimens are shown`,
  errorsOccurred:
    'The following errors occurred while trying to display the map:',
  noMap: 'Failed to find a projection map',
});

export default lifemapperText;
