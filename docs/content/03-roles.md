---
title: Roles
---

```typescript
import { AccessControl } from '@endemolshinegroup/acl';

const acl = new AccessControl(rolesConfig);

// Extending permission
acl.allow(`${role}`).toExtend(`${role2}`);

// Removing role
acl.remove(`${role}`);

// Retrieving roles
acl.getRoles();

// Retrieving a list of role names
acl.getRolesList();

// Retrieving permissions for role
acl.getPermissions(role: string);
```
