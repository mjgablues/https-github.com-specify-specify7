import { theories } from '../../../tests/utils';
import {
  getFieldOverwrite,
  getGlobalFieldOverwrite,
  getTableOverwrite,
} from '../schemaOverrides';

theories(getTableOverwrite, [
  { in: ['Accession'], out: 'commonBaseTable' },
  { in: ['TaxonTreeDefItem'], out: 'system' },
  { in: ['SpQuery'], out: undefined },
]);

theories(getGlobalFieldOverwrite, [
  { in: ['Taxon', 'isAccepted'], out: 'readOnly' },
  { in: ['Geography', 'timestampCreated'], out: 'readOnly' },
  { in: ['SpecifyUser', 'id'], out: undefined },
]);

theories(getFieldOverwrite, [
  { in: ['Taxon', 'timestampCreated'], out: 'hidden' },
  { in: ['Agent', 'agentType'], out: 'optional' },
  { in: ['Agent', 'lastName'], out: undefined },
  { in: ['Attachment', 'collectingTripAttachments'], out: 'hidden' },
]);
