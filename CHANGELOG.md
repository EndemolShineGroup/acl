# [2.0.0](https://github.com/EndemolShineGroup/acl/compare/v1.1.2...v2.0.0) (2018-12-06)


### Bug Fixes

* **access control:** bunch of small fixes ([840eadd](https://github.com/EndemolShineGroup/acl/commit/840eadd))
* **errors:** remove default value ([5dab9f4](https://github.com/EndemolShineGroup/acl/commit/5dab9f4))


### Code Refactoring

* **exports:** change named export to default export ([e5950e8](https://github.com/EndemolShineGroup/acl/commit/e5950e8))


### Features

* **resolvers:** create resolvers to normalise input ([aec5750](https://github.com/EndemolShineGroup/acl/commit/aec5750))


### BREAKING CHANGES

* **exports:** This was done so we can import as a default export
instead of a named export

## [1.1.2](https://github.com/EndemolShineGroup/acl/compare/v1.1.1...v1.1.2) (2018-09-18)


### Bug Fixes

* use named export for AccessControl ([d92cd37](https://github.com/EndemolShineGroup/acl/commit/d92cd37))

## [1.1.1](https://github.com/EndemolShineGroup/acl/compare/v1.1.0...v1.1.1) (2018-09-16)


### Bug Fixes

* **npm:** fix main and types paths in package.json ([d74fcc2](https://github.com/EndemolShineGroup/acl/commit/d74fcc2))

# [1.1.0](https://github.com/EndemolShineGroup/acl/compare/v1.0.0...v1.1.0) (2018-09-14)


### Features

* **logging:** add debug package to project for logging errors ([a82b57f](https://github.com/EndemolShineGroup/acl/commit/a82b57f))

# 1.0.0 (2018-09-14)


### Bug Fixes

* export all types ([673ff3b](https://github.com/EndemolShineGroup/acl/commit/673ff3b))
* fix issue with adding new roles via grant in main class ([66d716c](https://github.com/EndemolShineGroup/acl/commit/66d716c))


### Features

* add DoesAnyStep and HaveAnyStep to check multiple roles at the same time ([411c959](https://github.com/EndemolShineGroup/acl/commit/411c959))
* add getRolesList(), getPermissions() and doesAny() methods ([11d8437](https://github.com/EndemolShineGroup/acl/commit/11d8437))
* make allow.toExtend() create a role when extending existing role ([c018300](https://github.com/EndemolShineGroup/acl/commit/c018300))
* update steps to pass internal flag when calling getRoles() ([845a957](https://github.com/EndemolShineGroup/acl/commit/845a957))
