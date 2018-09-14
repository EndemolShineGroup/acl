# acl

[![MIT Licensed][icon-license]][link-license]
[![NPM Version][icon-npm]][link-npm]
[![Build Status][icon-ci]][link-ci]
[![Greenkeeper Status][icon-greenkeeper]][link-greenkeeper]

[![Code Issues][icon-issues]][link-issues]
[![Codebase Maintainability][icon-maintainability]][link-maintainability]
[![Test Coverage][icon-coverage]][link-coverage]
[![Jest][icon-jest]][link-jest]

[![Commitizen][icon-commitizen]][link-commitizen]
[![Semantic Release][icon-semantic-release]][link-semantic-release]
[![Prettier][icon-prettier]][link-prettier]

Fully-tested AccessControl implementation written in TypeScript.

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

[icon-license]: https://img.shields.io/github/license/EndemolShineGroup/acl.svg?longCache=true&style=flat-square
[link-license]: LICENSE
[icon-npm]: https://img.shields.io/npm/v/@endemolshinegroup/acl.svg?longCache=true&style=flat-square
[link-npm]: https://www.npmjs.com/package/@endemolshinegroup/acl
[icon-ci]: https://img.shields.io/travis/EndemolShineGroup/acl.svg?longCache=true&style=flat-square
[link-ci]: https://travis-ci.org/EndemolShineGroup/acl
[icon-greenkeeper]: https://img.shields.io/badge/greenkeeper-enabled-brightgreen.svg?longCache=true&style=flat-square
[link-greenkeeper]: https://greenkeeper.io/

[icon-issues]: https://img.shields.io/codeclimate/issues/EndemolShineGroup/acl.svg?longCache=true&style=flat-square
[link-issues]: https://codeclimate.com/github/EndemolShineGroup/acl/issues
[icon-maintainability]: https://img.shields.io/codeclimate/maintainability/EndemolShineGroup/acl.svg?longCache=true&style=flat-square
[link-maintainability]: https://codeclimate.com/github/EndemolShineGroup/acl
[icon-coverage]: https://img.shields.io/codecov/c/github/EndemolShineGroup/acl/develop.svg?longCache=true&style=flat-square
[link-coverage]: https://codecov.io/gh/EndemolShineGroup/acl

[icon-jest]: https://img.shields.io/badge/tested_with-jest-99424f.svg?longCache=true&style=flat-square
[link-jest]: https://jestjs.io/

[icon-commitizen]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?longCache=true&style=flat-square
[link-commitizen]: http://commitizen.github.io/cz-cli/
[icon-semantic-release]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?longCache=true&style=flat-square
[link-semantic-release]: https://semantic-release.gitbooks.io/semantic-release/
[icon-prettier]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?longCache=true&style=flat-square
[link-prettier]: https://prettier.io/
