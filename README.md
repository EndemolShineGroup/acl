# package-accesscontrol
AccessControl package in typescript with tests

# install
`yarn add esgt-access-control`
or
`npm i esgt-access-control --save`

# Types
  ```
  ACGrants {
    // [env]: boolean
    [key: string]: boolean;
  }
  ```

  ```
  ACPermissions {
    // [job] : envs
    [key: string]: ACGrants;
  }
  ```

  ```
  ACRoles {
    //[role] : jobs
    [key: string] : ACPermissions;
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

#CHANGE LOG
  `version 0.0.6`

    ```
      - Fixed bug with adding new roles via 'grant';
      - Added todo.md;
      - Fixed log from being displayed on internal requests;
      - Updated internal request to 'getRoles' to be flagged as interal;
    ```

  `version 0.0.7`

    ```
      - Extended 'allow.toExtend' functionality to create new role when extending from existent role;
      - Updated tests for the new feature;
    ```
