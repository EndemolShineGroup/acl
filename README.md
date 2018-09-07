# package-accesscontrol
AccessControl package in typescript with tests

# Types
  `enum Stage { dev, staging, prod }`

  ```
  ACGrantsObject {
    [key: string] : {
      [key: string] : {
        dev: boolean,
        staging: boolean,
        prod: boolean,
      }
    }
  }
```

# Data example
```
const grantObj = {
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
`Setting grants`
```
    const ac = new AccessControl(grantsObj);
    
    or

    ac.setGrants();
```
 `Checking permissions`
 ```
  ac.does(`${role}`).havePermission(`${permission}`).for(${Stage});
```
`Granting permission`
```
  ac.grant(`${role}`).permission(`${permission}`).for(${Stage[]});
```
`Denying permission`
```
  ac.deny(`${role}`).permission(`${permission}`).for(${Stage[]});
```
`Extending permission`
```
  ac.allow(`${role}`).toExtend(`${role2}`);
```
`Removing role`
```
  ac.remove(`${role}`);
```
`Retrieving grants`
```
  ac.getGrants();
```
