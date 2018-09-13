# acl

Fully-tested AccessControl implementation in TypeScript

# install
`yarn add @endemolshinegroup/acl`
or
`npm i @endemolshinegroup/acl --save`

# Types
  ```
  Grants {
    // [env]: boolean
    [key: string]: boolean;
  }
  ```

  ```
  Permissions {
    // [job] : envs
    [key: string]: Grants;
  }
  ```

  ```
  Roles {
    //[role] : jobs
    [key: string] : Permissions;
  }
  ```

# Data example
```
const rolesObj = {
  User: {
    GetUsers: {
      dev: true,
      staging: false,
      prod: false,
    }
  }
}
```

# API:
`Setting roles`
```
const ac = new AccessControl(rolesObj); // constructor

or

ac.setRoles(rolesObj); // any time
```
`Checking permissions (boolean)`
```
ac.does(`${role}`).havePermission(`${permission}`).for(`${stage}`);
```
`Granting permission (void)`
```
ac.grant(`${role}`).permission(`${permission}`).for(`${stage[]}`);
```
`Denying permission (void)`
```
ac.deny(`${role}`).permission(`${permission}`).for(`${stage[]}`);
```
`Extending permission (void)`
```
ac.allow(`${role}`).toExtend(`${role2}`);
```
`Removing role (void)`
```
ac.remove(`${role}`);
```
`Retrieving roles obj (ACRoles)`
```
ac.getRoles();
```
`Retrieving roles list (string[])`
```
ac.getRolesList();
```
`Retrieving permissions for role (ACPermissions)`
```
ac.getPermissions(role: string);
```
