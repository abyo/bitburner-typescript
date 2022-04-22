import * as bitburner from './NetscriptDefinitions';

export {};

declare global {
  type NS = bitburner.NS;

  type AutocompleteConfig = [string, string | number | boolean | string[]][];

  interface AutocompleteData {
    servers: string[];
    txts: string[];
    scripts: string[];
    flags: (config: AutocompleteConfig) => unknown;
  }
}
