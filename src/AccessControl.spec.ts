import AccessControl from './AccessControl';

import rolesFixture from './__fixtures__/roles';
import AccessControlError from './Errors/AccessControlError';

type ConsoleLog = (message?: any, ...optionalParams: any[]) => void;
type ConsoleError = ConsoleLog;

describe('Access Control', () => {

  let ACWithGrants: AccessControl;
  let ACWithoutGrants: AccessControl;

  beforeEach(() => {
    ACWithGrants = new AccessControl(rolesFixture);
    ACWithoutGrants = new AccessControl();
  });

  it('`getRoles()` should return the data passed in the constructor', () => {
    expect(ACWithGrants.getRoles()).toEqual(rolesFixture);
  });

  it('`getRoles()` should return the data passed in via `setRoles()`', () => {
    ACWithoutGrants.setRoles(rolesFixture);

    expect(ACWithGrants.getRoles()).toEqual(rolesFixture);
  });

  it('`getRoles()` should throw an error if no grants were passed to AccessControl', () => {
    expect(() => { ACWithoutGrants.getRoles(); }).toThrow(AccessControlError);
  });

  it('get permission should return false', () => {
    expect(ACWithGrants.does('User').havePermission('GetUsers').for('dev')).toBeFalsy();
  });

  it('get permission should return true', () => {
    expect(ACWithGrants.does('User').havePermission('GetUsers').for('prod')).toBeTruthy();
  });

  it('grant permission should return true', () => {
    ACWithGrants.grant('User').permission('GetUsers').for('dev');

    expect(ACWithGrants.does('User').havePermission('GetUsers').for('dev')).toBeTruthy();
  });

  it('grant permission to a new role should create role with all true stages', () => {
    ACWithGrants.grant('Test').permission('GetUsers').for('dev', 'staging', 'prod');

    const result = ACWithGrants.getRoles();
    expect(result).toHaveProperty('Test');
    expect(result.Test).toEqual({
      GetUsers: {
        dev: true,
        staging: true,
        prod: true,
      },
    });
  });

  it('grant permission to a new role should create role with all false stages', () => {
    ACWithGrants.grant('Test').permission('GetUsers').for();

    const result = ACWithGrants.getRoles();
    expect(result).toHaveProperty('Test');
    expect(result.Test).toEqual({
      GetUsers: {
        dev: false,
        staging: false,
        prod: false,
      },
    });
  });

  it('should throw an AccessControlError when trying to extend a nonexistent role', () => {

    expect(() => { ACWithGrants.allow('Dev').toExtend('Text'); }).toThrow(AccessControlError);

    // Role should not mutate if the error occurs
    const result = ACWithGrants.getRoles();
    expect(result).toHaveProperty('Dev');
    expect(result.Dev).toEqual({
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
    });
  });

  it('extending NEW role 1 should have all permissions existing role 2 has', () => {
    ACWithGrants.allow('Test').toExtend('Dev');

    const result = ACWithGrants.getRoles();
    expect(result).toHaveProperty('Test');
    expect(result.Test).toEqual({
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
    });
  });

  it('extending role 1 should have all permissions role 2 has', () => {
    ACWithGrants.allow('User').toExtend('Dev');

    expect(ACWithGrants.does('User').havePermission('GetUsers').for('dev')).toBeTruthy();
    expect(ACWithGrants.does('User').havePermission('GetUsers').for('staging')).toBeTruthy();
    expect(ACWithGrants.does('User').havePermission('GetUsers').for('prod')).toBeTruthy();
    expect(ACWithGrants.does('User').havePermission('SaveUsers').for('dev')).toBeTruthy();
    expect(ACWithGrants.does('User').havePermission('SaveUsers').for('staging')).toBeTruthy();
    expect(ACWithGrants.does('User').havePermission('SaveUsers').for('prod')).toBeFalsy();
  });

  it('extending role 1 should have all permissions role 2 has', () => {
    ACWithGrants.allow('User').toExtend('Dev');

    const result = ACWithGrants.getRoles();
    expect(result).toHaveProperty('User');
    expect(result.User).toEqual({
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
    });
  });

  it('extending role 1 should not have permissions stripped if role 2 doesnt have', () => {
    ACWithGrants.allow('Admin').toExtend('Dev');

    // In `dev` prod is false but `admin` is true, extending `dev` should not make the value false
    expect(ACWithGrants.does('Admin').havePermission('SaveUsers').for('prod')).toBeTruthy();
  });

  it('permission denied should return false', () => {
    ACWithGrants.deny('Admin').permission('SaveUsers').for('prod');

    expect(ACWithGrants.does('Admin').havePermission('SaveUsers').for('prod')).toBeFalsy()
  });

  // @TODO Shouldn't this just throw an error?
  it('remove role should remove permissions as well', () => {
    ACWithGrants.remove('User');

    expect(ACWithGrants.does('User').havePermission('SaveUsers').for('prod')).toBeFalsy()
  });

  it('should return true when calling `DoesAny` with User and Admin for SaveUser.prod', () => {
    expect(ACWithGrants.doesAny(['User', 'Admin']).havePermission('SaveUsers').for('prod')).toBeTruthy();
  });

  it('should return false when calling `DoesAny` with User and Dev for SaveUser.prod', () => {
    expect(ACWithGrants.doesAny(['User', 'Dev']).havePermission('SaveUsers').for('prod')).toBeFalsy();
  });

  it('should return a list of string with all roles', () => {
    expect(ACWithGrants.getRolesList()).toEqual([
      'User',
      'Admin',
      'Dev'
    ]);
  });

  it('should return a list of string with all modified roles', () => {

    ACWithGrants.grant('Test').permission('GetUsers').for('dev', 'staging', 'prod');

    expect(ACWithGrants.getRolesList()).toEqual([
      'User',
      'Admin',
      'Dev',
      'Test'
    ]);
  });

  it('should return an object with role permissions', () => {
    expect(ACWithGrants.getPermissions('User')).toEqual({
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
    expect(() => { ACWithGrants.getPermissions('Test'); }).toThrow(AccessControlError);
  });

  it('should create a new role with new permissions even if we don`t set initial object', () => {
    ACWithoutGrants.grant('NEW_ROLE').permission('NEW_PERMISSION').for('dev', 'staging')

    const result = ACWithoutGrants.getRoles();
    expect(result).toHaveProperty('NEW_ROLE');
    expect(result.NEW_ROLE).toEqual({
      NEW_PERMISSION: {
        dev: true,
        staging: true,
        prod: false,
      },
    });
  });
});
