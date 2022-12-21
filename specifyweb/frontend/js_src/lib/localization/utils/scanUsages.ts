/**
 *
 * Walks through front-end files in search of invalid usages of localization
 * keys.
 *
 * Accepts optional --verbose` argument to enable verbose output
 *
 * @remarks
 * Most localization errors are caught by TypeScript typing. This test only
 * checks for errors that are not reported by TypeScript.
 */

import fs from 'node:fs';
import path from 'node:path';

import type { IR, R, RA, RR, WritableArray } from '../../utils/types';
import { filterArray } from '../../utils/types';
import { split } from '../../utils/utils';
import type { Language } from './index';
import {
  DEFAULT_LANGUAGE,
  languages,
  LocalizationDictionary as LanguageDictionary,
  LocalizationEntry,
  localizationMetaKeys,
  rawDictionary,
  whitespaceSensitive,
} from './index';
import { f } from '../../utils/functools';
import { formatList } from '../../components/Atoms/Internationalization';
import { testLogging } from './testLogging';

if (process.argv[1] === undefined)
  throw new Error('Unable to find the path of the current directory');

// CONFIGURATION
const localizationDirectory = path.dirname(path.dirname(process.argv[1]));
const extensionsToScan = new Set(['js', 'jsx', 'ts', 'tsx']);
const libraryDirectory = path.dirname(localizationDirectory);
const dictionaryExtension = '.ts';

/**
 * Forbid certain characters in localization strings
 * Used for catching bugs like https://github.com/specify/specify7/issues/1739
 */
const characterBlacklist: Partial<RR<Language, string>> = {
  'en-us': 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя',
};

const { log, todosCount, warningsCount, todo, warn, error, errorsCount } =
  testLogging;

/**
 * Collect localization strings from all files into a single object
 */
async function extractStrings(): Promise<
  IR<{
    readonly dictionaryName: string;
    readonly strings: IR<LocalizationEntry>;
  }>
> {
  log(`Looking for localization dictionaries in ${localizationDirectory}`);
  const localizationFiles = fs.readdirSync(localizationDirectory);

  const extracted = await Promise.all(
    localizationFiles.map(async (filePath) => {
      if (!path.extname(filePath).endsWith(dictionaryExtension))
        return undefined;

      const compiledFilePath = path.join(localizationDirectory, filePath);
      const filePathWithoutExtension = compiledFilePath
        .split('.')
        .slice(0, -1)
        .join('.');
      const fileName = filePathWithoutExtension.split('/').at(-1)!;

      const dictionaryFile = await import(filePathWithoutExtension);

      const dictionaries = Object.keys(dictionaryFile ?? {}).filter(
        (dictionaryName) => dictionaryName.endsWith('Text')
      );
      if (dictionaries.length > 1)
        error(
          `Found multiple dictionaries in ${fileName}: ${dictionaries.join(
            ', '
          )}`
        );
      const dictionaryName = dictionaries[0];
      const strings = Object.getOwnPropertyDescriptor(
        dictionaryFile?.[dictionaryName ?? ''] ?? {},
        rawDictionary
      )?.value as LanguageDictionary | undefined;
      if (typeof dictionaryName !== 'string' || typeof strings !== 'object') {
        error(`Unable to find a dictionary in ${fileName}`);
        return undefined;
      }

      if (typeof strings !== 'object') {
        error(
          `Unable to find a dictionary in ${fileName}. Make sure it is called ` +
            `${dictionaryName} and is wrapped in a call to createDictionary()`
        );
        return undefined;
      }

      if (Object.keys(strings).length === 0) {
        error(`Unable to find any keys in the ${dictionaryName} dictionary`);
        return undefined;
      }

      return [fileName, { dictionaryName, strings }];
    })
  );

  return Object.fromEntries(Array.from(filterArray(extracted)));
}

const lookAroundLength = 40;

const expectedKeys = new Set([...languages, ...localizationMetaKeys]);

export type DictionaryUsages = IR<{
  readonly categoryName: string;
  readonly strings: IR<{
    readonly strings: LocalizationEntry;
    readonly usages: WritableArray<{
      readonly filePath: string;
      readonly lineNumber: number;
    }>;
  }>;
}>;

export async function scanUsages(
  verbose: boolean
): Promise<DictionaryUsages | undefined> {
  const debug = verbose ? console.log : () => undefined;

  const entries = await extractStrings();

  const dictionaries: DictionaryUsages = Object.fromEntries(
    Object.entries(entries).map(
      ([categoryName, { dictionaryName, strings }]) => {
        return [
          dictionaryName,
          {
            categoryName,
            strings: Object.fromEntries(
              Object.entries(strings).map(([key, strings]) => {
                Object.keys(strings)
                  .filter((key) => !f.has(expectedKeys, key))
                  .forEach((language) =>
                    error(
                      [
                        `A string for an undefined language ${language} was `,
                        `found for key ${dictionaryName}.${key}\n`,
                        `Defined languages: ${formatList(languages)}\n`,
                        `Allowed meta keys: ${formatList(
                          localizationMetaKeys
                        )}\n`,
                        `If you want to add a new language, add it to the `,
                        `languages array in ./localization/utils.tsx`,
                      ].join('')
                    )
                  );

                // Search for blacklisted characters
                Object.entries(strings).forEach(([language, string]) => {
                  if (f.includes(localizationMetaKeys, language)) return;

                  characterBlacklist[language]
                    ?.split('')
                    .forEach((character) =>
                      string!.toString().toLowerCase().includes(character)
                        ? error(
                            [
                              `String ${dictionaryName}.${key} for language `,
                              `${language} contains a blacklisted character `,
                              `"${character}"`,
                            ].join('')
                          )
                        : undefined
                    );
                });

                return [
                  key,
                  {
                    strings: {
                      ...strings,
                      comment: f.maybe(strings.comment, whitespaceSensitive),
                    },
                    usages: [],
                  },
                ];
              })
            ),
          },
        ];
      }
    )
  );

  if (Object.keys(dictionaries).length === 0)
    error('Unable to find any localization dictionaries');

  /**
   * Recursively collect all files in subdirectories
   */
  function gatherFiles(directoryPath: string): RA<string> {
    const [files, directories] = split(
      fs.readdirSync(directoryPath, { withFileTypes: true }),
      (dirent) => dirent.isDirectory()
    ).map((entries) =>
      entries.map(({ name }) => path.join(directoryPath, name))
    );
    return [...files, ...directories.flatMap(gatherFiles)];
  }

  const sourceFiles = gatherFiles(libraryDirectory).filter((fileName) =>
    extensionsToScan.has(fileName.split('.').at(-1)!)
  );

  debug('Looking for usages of strings');
  sourceFiles.forEach((filePath) => {
    const fileName = path.basename(filePath);
    debug(`Looking for language string usages in ${fileName}`);

    const fileContent = fs.readFileSync(filePath).toString();
    let foundUsages = false;

    Object.entries(dictionaries).forEach(([dictionaryName, { strings }]) => {
      const usages = fileContent.matchAll(
        new RegExp(
          `${dictionaryName}\\s*(?<follower>.)(?<keyName>\\w*)(?:(?<openBracket>\\()\\s*(?<followCharacter>.))?`,
          'gu'
        )
      );

      Array.from(usages, ({ groups, index }) => {
        if (groups === undefined || index === undefined) return;

        const followingCharacter = groups.follower ?? '';

        const position = fileContent.slice(
          index - lookAroundLength,
          index + lookAroundLength + dictionaryName.length + 20
        );
        const lineNumber = fileContent.slice(0, index).split('\n').length;

        const report = (...message: RA<string>): void =>
          error(
            [
              ...message,
              `\n\n`,
              `On line ${lineNumber}:\n`,
              `${position}`,
            ].join('')
          );

        // Matched an import statement (i.e, import { commonText } from ...)
        if (followingCharacter === '}') return;
        // Matched the declaration of a dictionary (i.e, const commonText = ...)
        if (followingCharacter === '=') return;
        if (followingCharacter !== '.') {
          report(
            `Unexpected dynamic usage of a ${dictionaryName} dictionary\n`,
            'Only static usages are supported to allow for static analysis.',
            followingCharacter === '['
              ? '\nDid you mean to use object index notation instead of array index notation?'
              : ''
          );
          return;
        }

        const keyName = groups.keyName ?? '';
        if (keyName.length === 0) {
          report(
            `Unexpected usage of a ${dictionaryName} dictionary without a `,
            'localization key'
          );
          return;
        }

        if (!(keyName in strings)) {
          report(
            `Found unknown key ${dictionaryName}.${keyName} in ${fileName}`
          );
          return;
        }

        if (groups.openBracket !== '(') {
          report(
            `Unexpected usage of a ${dictionaryName}.${keyName} key\n`,
            `Expected a function call (i.e ${dictionaryName}.${keyName}()`
          );
          return;
        }

        const hasArguments = groups.followCharacter !== ')';
        const expectsArguments =
          strings[keyName].strings[DEFAULT_LANGUAGE]?.includes('}') ?? false;

        if (expectsArguments !== hasArguments) {
          if (hasArguments)
            report(
              `${fileName} provides arguments to ${dictionaryName}.${keyName} `,
              `but it is not supposed to.`
            );
          else
            report(
              `${fileName} does not provide arguments to `,
              `${dictionaryName}.${keyName} but it is supposed to.`
            );
        }

        strings[keyName].usages.push({
          filePath,
          lineNumber,
        });
        foundUsages = true;
      });
    });

    if (!foundUsages) debug(`Didn't find any usages in ${fileName}`);
  });

  // Find duplicate values
  const compoundDictionaries: Partial<
    Record<
      Language,
      R<
        WritableArray<{
          readonly fileName: string;
          readonly key: string;
          readonly originalValue: string;
        }>
      >
    >
  > = {};

  Object.entries(dictionaries).forEach(
    ([fileName, { strings }]) =>
      Object.entries(strings).forEach(([key, { strings }]) => {
        languages.forEach((language) => {
          const value = strings[language];

          if (value === undefined) {
            todo(
              `Missing localization string for key ${fileName}.${key} for ` +
                `language ${language}`
            );
            return;
          }

          compoundDictionaries[language] ??= {};
          compoundDictionaries[language]![value.toLowerCase()] ??= [];
          compoundDictionaries[language]![value.toLowerCase()].push({
            fileName,
            key,
            originalValue: value,
          });
        });
      }),
    {}
  );

  Object.entries(compoundDictionaries).forEach(([language, valueDictionary]) =>
    Object.entries(valueDictionary ?? {})
      .filter(([_valueString, instances]) => instances.length > 1)
      .forEach(([valueString, instances]) => {
        warn(
          [
            'Multiple instances of the same value were found for language ',
            `${language} in:\n`,
            ...instances.map(
              ({ fileName, key }) => `\t"${fileName}" under key "${key}"\n`
            ),
            'Value:\n',
            instances.at(-1)?.originalValue ?? valueString,
          ].join('')
        );
      })
  );

  // Unused key errors
  Object.entries(dictionaries).forEach(([dictionaryName, { strings }]) =>
    Object.entries(strings)
      .filter(([_keyName, { usages }]) => usages.length === 0)
      .forEach(([keyName]) =>
        error(`No usages of ${dictionaryName}.${keyName} found`)
      )
  );

  // Output stats
  debug(dictionaries);
  if (verbose)
    Object.entries(dictionaries).forEach(([dictionaryName, { strings }]) =>
      log(
        `${dictionaryName} has ${
          Object.keys(strings).length
        } keys with a total use count of ${Object.values(strings)
          .map(({ usages }) => usages.length)
          .reduce((total, useCount) => total + useCount, 0)}`
      )
    );
  todo(`TODOs: ${todosCount}`);
  warn(`Warnings: ${warningsCount}`);
  // Not using error() here as that would change the exit code to 1
  warn(`Errors: ${errorsCount}`);

  if (errorsCount > 0) return undefined;
  else return dictionaries;
}
