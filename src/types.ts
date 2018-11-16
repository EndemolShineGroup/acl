export interface Grants {
  // [env]: boolean
  [key: string]: boolean;
}

export interface Permissions {
  // [job] : envs
  [key: string]: Grants;
}

export interface Roles {
  //[role] : jobs
  [key: string]: Permissions;
}

export interface GrantQuery {
  roles: string[];
  permissions: string[];
  environments: string[];
  any?: boolean;
}

// Basic types
export interface StringObj {
  [key: string]: string;
}
