export interface Found {
  name: string;
  version: string;
  nodeModules: string;
}

export interface InstallOptions {
  cwd?: string;
}

export type InstallCallback = (err?: Error) => void;
