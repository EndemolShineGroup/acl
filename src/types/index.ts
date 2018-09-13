export interface ACGrants {
  // [env]: boolean
  [key: string]: boolean;
}

export interface ACPermissions {
  // [job] : envs
  [key: string]: ACGrants;
}

export interface ACRoles {
  //[role] : jobs
  [key: string] : ACPermissions;
}

export interface GrantQuery {
  role: string;
  permission: string;
  environment: string;
  roles?: string[];
}

// Basic types
export interface StringObj {
  [key: string] : string;
}
