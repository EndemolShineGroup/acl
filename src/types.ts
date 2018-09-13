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
  role: string;
  permission: string;
  environment: string;
  roles?: string[];
}

// Basic types
export interface StringObj {
  [key: string]: string;
}
