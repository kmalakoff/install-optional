export interface Found {
  name: string;
  version: string;
  nodeModules: string;
}

export type FilterFunction = (packageName: string) => boolean;

export interface InstallOptions {
  cwd?: string;
  filter?: FilterFunction;
}

export type InstallCallback = (err?: Error) => void;
