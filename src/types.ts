export interface Found {
  name: string;
  version: string;
  nodeModules: string;
}

export interface InstallOptions {
  nested?: boolean;
}

export type InstallCallback = (err?: Error) => void;
