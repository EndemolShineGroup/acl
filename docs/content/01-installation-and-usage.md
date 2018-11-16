---
title: Installation
---

## Installation

`yarn add @endemolshinegroup/acl`
or
`npm i @endemolshinegroup/acl --save`

## Usage

```typescript
import AccessControl from '@endemolshinegroup/acl';

const roles = {
  users: {
    GetUsers: {
      dev: true,
      staging: false,
      prod: false,
    }
  }
};

const acl = new AccessControl(roles);
```
