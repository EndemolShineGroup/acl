export enum Stage { 'dev', 'staging', 'prod' }

export interface ACGrantsObject {
  [key: string] : {
    [key: string] : {
      dev: boolean,
      staging: boolean,
      prod: boolean,
    }
  }
}

export interface GrantQuery {
  role: string;
  permission: string;
  environment: Stage;
}
