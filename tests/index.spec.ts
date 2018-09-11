import 'mocha';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import AccessControl from '../src';
import { ACRoles } from '../src/types';

const expect = chai.expect;

chai.use(sinonChai);

const GrantsObj: ACRoles = {
    User: {
        GetUsers: {
            dev: false,
            staging: false,
            prod: true,
        },
        SaveUsers: {
            dev: false,
            staging: false,
            prod: false,
        }
    },
    Admin: {
        GetUsers: {
            dev: true,
            staging: true,
            prod: true,
        },
        SaveUsers: {
            dev: true,
            staging: true,
            prod: true,
        }
    },
    Dev: {
        GetUsers: {
            dev: true,
            staging: true,
            prod: true,
        },
        SaveUsers: {
            dev: true,
            staging: true,
            prod: false,
        }
    }
}

let ACWithGrants: AccessControl;

let ACWithoutGrants: AccessControl

describe('Access Control', () => {

  beforeEach(() => {
    ACWithGrants = new AccessControl(GrantsObj);
    ACWithoutGrants = new AccessControl();
  })

  // Set console.error spy once
  sinon.spy(console, 'error');

  it('`getRoles()` should return the data passed in the constructor', () => {
    expect(ACWithGrants.getRoles()).to.deep.equal(GrantsObj);
  });

  it('`getRoles()` should return the data passed in via `setRoles()`', () => {
    ACWithoutGrants.setRoles(GrantsObj);

    expect(ACWithGrants.getRoles()).to.deep.equal(GrantsObj);
  });

  it('`getRoles()` should console.error if no grantsObj has been passed to AccessControl', () => {
    ACWithoutGrants.getRoles();

    expect(console.error).to.be.called;
  });

  it('get permission should return false', () => {
    expect(ACWithGrants.does('User').havePermission('GetUsers').for('dev')).to.be.false;
  });

  it('get permission should return true', () => {
    expect(ACWithGrants.does('User').havePermission('GetUsers').for('prod')).to.be.true;
  });

  it('grant permission should return true', () => {
    ACWithGrants.grant('User').permission('GetUsers').for('dev');

    expect(ACWithGrants.does('User').havePermission('GetUsers').for('dev')).to.be.true;
  });

  it('grant permission to a new role should create role with all true stages', () => {
    ACWithGrants.grant('Test').permission('GetUsers').for('dev', 'staging', 'prod');

    expect(ACWithGrants.getRoles()).to.deep.include({
      'Test': {
        GetUsers: {
          dev: true,
          staging: true,
          prod: true,
        },
      }
    });
  });

  it('grant permission to a new role should create role with all false stages', () => {
    ACWithGrants.grant('Test').permission('GetUsers').for();

    expect(ACWithGrants.getRoles()).to.deep.include({
          'Test': {
              GetUsers: {
                  dev: false,
                  staging: false,
                  prod: false,
              },
          }
      });
  });

  it('should `console.error` when trying to extend nonexistent role and role to keep the same', () => {
    ACWithGrants.allow('Dev').toExtend('Text');

    expect(console.error).to.be.called;

    // Role should not mutate if the error occurs
    expect(ACWithGrants.getRoles()).to.deep.include({
      Dev: {
        GetUsers: {
            dev: true,
            staging: true,
            prod: true,
        },
        SaveUsers: {
            dev: true,
            staging: true,
            prod: false,
        }
      }
    });
  });

  it('extending NEW role 1 should have all permissions existing role 2 has', () => {
    ACWithGrants.allow('Test').toExtend('Dev');

    expect(ACWithGrants.getRoles()).to.deep.include({
      Test: {
        GetUsers: {
            dev: true,
            staging: true,
            prod: true,
        },
        SaveUsers: {
            dev: true,
            staging: true,
            prod: false,
        }
      }
    });
  });

  it('extending role 1 should have all permissions role 2 has', () => {
    ACWithGrants.allow('User').toExtend('Dev');

    expect(ACWithGrants.does('User').havePermission('GetUsers').for('dev')).to.be.true
      .and
    expect(ACWithGrants.does('User').havePermission('GetUsers').for('staging')).to.be.true
      .and
    expect(ACWithGrants.does('User').havePermission('GetUsers').for('prod')).to.be.true
      .and
    expect(ACWithGrants.does('User').havePermission('SaveUsers').for('dev')).to.be.true
      .and
    expect(ACWithGrants.does('User').havePermission('SaveUsers').for('staging')).to.be.true
      .and
    expect(ACWithGrants.does('User').havePermission('SaveUsers').for('prod')).to.be.false
  });

  it('extending role 1 should have all permissions role 2 has', () => {
    ACWithGrants.allow('User').toExtend('Dev');

    expect(ACWithGrants.getRoles()).to.deep.include({
      User: {
        GetUsers: {
            dev: true,
            staging: true,
            prod: true,
        },
        SaveUsers: {
            dev: true,
            staging: true,
            prod: false,
        }
      }
    });
  });

  it('extending role 1 should not have permissions stripped if role 2 doesnt have', () => {
    ACWithGrants.allow('Admin').toExtend('Dev');

    // In `dev` prod is false but `admin` is true, extending `dev` should not make the value false
    expect(ACWithGrants.does('Admin').havePermission('SaveUsers').for('prod')).to.be.true
  });

  it('permission denied should return false', () => {
    ACWithGrants.deny('Admin').permission('SaveUsers').for('prod');

    expect(ACWithGrants.does('Admin').havePermission('SaveUsers').for('prod')).to.be.false
  });

  it('remove role should console.error and be inaccessible', () => {
    ACWithGrants.remove('User');

    expect(ACWithGrants.does('User').havePermission('SaveUsers').for('prod')).to.be.false

    expect(console.error).to.be.called;
  });

  it('should return true when calling `DoesAny` with User and Admin for SaveUser.prod', () => {
    expect(ACWithGrants.doesAny(['User', 'Admin']).havePermission('SaveUsers').for('prod')).to.be.true
  });

  it('should return false when calling `DoesAny` with User and Dev for SaveUser.prod', () => {
    expect(ACWithGrants.doesAny(['User', 'Dev']).havePermission('SaveUsers').for('prod')).to.be.false
  });

  it('should return a list of string with all roles', () => {
    expect(ACWithGrants.getRolesList()).to.deep.equal([
      'User',
      'Admin',
      'Dev'
    ]);
  });

  it('should return a list of string with all modified roles', () => {

    ACWithGrants.grant('Test').permission('GetUsers').for('dev', 'staging', 'prod');

    expect(ACWithGrants.getRolesList()).to.deep.equal([
      'User',
      'Admin',
      'Dev',
      'Test'
    ]);
  });

  it('should return an object with role permissions', () => {
    expect(ACWithGrants.getPermissions('User')).to.deep.equal( {
      GetUsers: {
          dev: false,
          staging: false,
          prod: true,
      },
      SaveUsers: {
          dev: false,
          staging: false,
          prod: false,
      }
    });
  });

  it('should return console.error and return null for non existent role', () => {
    expect(ACWithGrants.getPermissions('Test')).to.deep.equal(null);

    expect(console.error).to.be.called;
  });

   it('should create a new role with new permissions even if we don`t set initial object', () => {
    ACWithoutGrants.grant('NEW_ROLE').permission('NEW_PERMISSION').for('dev', 'staging')

    expect(ACWithoutGrants.getRoles()).to.deep.include({
      NEW_ROLE: {
        NEW_PERMISSION: {
            dev: true,
            staging: true,
            prod: false,
        },
      }
    });
  });
});
