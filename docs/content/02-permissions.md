---
title: Permissions
---

```typescript
import { AccessControl } from '@endemolshinegroup/acl';

const acl = new AccessControl(rolesConfig);

// Checking permissions
acl.does('users').havePermission(`getData`).for('dev'); // true

// Granting a permission
acl.grant('users').permission('getData').for('staging', 'prod');

// Denying a permission
acl.deny('users').permission('getData').for('staging', 'prod');
```
