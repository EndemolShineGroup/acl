import AccessControl from './AccessControl';

import rolesFixture from './__fixtures__/roles';
import AccessControlError from './Errors/AccessControlError';
import PermissionNotFoundError from './Errors/PermissionNotFoundError';
import RoleNotFoundError from './Errors/RoleNotFoundError';

describe('Access Control', () => {
  let ACWithGrants: AccessControl;
  let ACWithoutGrants: AccessControl;

  beforeEach(() => {
    ACWithGrants = new AccessControl(rolesFixture);
    ACWithoutGrants = new AccessControl();
  });

  describe('DENY TESTS', () => {
    it('should return false when permission denied', () => {
      ACWithGrants.deny('Admin')
        .permission('SaveUsers')
        .for('prod');

      expect(
        ACWithGrants.does('Admin')
          .havePermissions('SaveUsers')
          .for('prod'),
      ).toBeFalsy();
    });

    it('should error when passing a role that does not exist', () => {
      expect(() => {
        ACWithGrants.deny('A_FAKE_ROLE')
          .permission('SaveUsers')
          .for('prod');
      }).toThrow(RoleNotFoundError);
    });

    it('should error when passing a permission that does not exist', () => {
      expect(() => {
        ACWithGrants.deny('Admin')
          .permission('A_FAKE_PERMISSION')
          .for('prod');
      }).toThrow(PermissionNotFoundError);
    });
  });

  it('should return  the data passed in the constructor when calling `getRoles()`', () => {
    expect(ACWithGrants.getRoles()).toEqual(rolesFixture);
  });

  it('should return the data passed in via `setRoles()` when calling `getRoles()`', () => {
    ACWithoutGrants.setRoles(rolesFixture);

    expect(ACWithGrants.getRoles()).toEqual(rolesFixture);
  });

  it('should throw an `AccessControlError` if no grants were passed to AccessControl when calling `getRoles()`', () => {
    expect(() => {
      ACWithoutGrants.getRoles();
    }).toThrow(AccessControlError);
  });

  it('should return false when getting permission', () => {
    expect(
      ACWithGrants.does('User')
        .havePermissions('GetUsers')
        .for('dev'),
    ).toBeFalsy();
  });

  it('should return true when getting permission', () => {
    expect(
      ACWithGrants.does('User')
        .havePermissions('GetUsers')
        .for('prod'),
    ).toBeTruthy();
  });

  it('should return false when getting permission (strict ALL)', () => {
    expect(
      ACWithGrants.does('User')
        .havePermissions('GetUsers')
        .for('prod', 'dev'),
    ).toBeFalsy();
  });

  it('should return true when getting permission (* roles)', () => {
    expect(
      ACWithGrants.does('*')
        .havePermissions('SaveUsers')
        .for('staging'),
    ).toBeTruthy();
  });

  it('should return false when getting permission (* permissions)', () => {
    expect(
      ACWithGrants.does('User')
        .havePermissions('*')
        .for('staging'),
    ).toBeFalsy();
  });

  it('should return false when getting permission (* permissions)', () => {
    expect(
      ACWithGrants.does('*')
        .havePermissions('*')
        .for('*'),
    ).toBeFalsy();
  });

  it('should return true when getting permission any (* envs)', () => {
    expect(
      ACWithGrants.doesAny('User')
        .havePermissions('GetUsers')
        .for('*'),
    ).toBeTruthy();
  });

  it('should return true when granting permission', () => {
    ACWithGrants.grant('User')
      .permission('GetUsers')
      .for('dev');

    expect(
      ACWithGrants.does('User')
        .havePermissions('GetUsers')
        .for('dev'),
    ).toBeTruthy();
  });

  it('should create role with all true stages when granting permission to a new role', () => {
    ACWithGrants.grant('Test')
      .permission('GetUsers')
      .for('dev', 'staging', 'prod');

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

  it('should create role with all false stages when granting permission to a new roles', () => {
    ACWithGrants.grant('Test')
      .permission('GetUsers')
      .for();

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

  it('should throw an RoleNotFoundError when trying to extend a nonexistent role', () => {
    expect(() => {
      ACWithGrants.allow('Dev').toExtend('Text');
    }).toThrow(RoleNotFoundError);

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
      },
    });
  });

  it('should have all permissions role 2 has when extending NEW role 1', () => {
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
      },
    });
  });

  it('should have all permissions role 2 has when extending role 1', () => {
    ACWithGrants.allow('User').toExtend('Dev');

    expect(
      ACWithGrants.does('User')
        .havePermissions('GetUsers')
        .for('dev'),
    ).toBeTruthy();
    expect(
      ACWithGrants.does('User')
        .havePermissions('GetUsers')
        .for('staging'),
    ).toBeTruthy();
    expect(
      ACWithGrants.does('User')
        .havePermissions('GetUsers')
        .for('prod'),
    ).toBeTruthy();
    expect(
      ACWithGrants.does('User')
        .havePermissions('SaveUsers')
        .for('dev'),
    ).toBeTruthy();
    expect(
      ACWithGrants.does('User')
        .havePermissions('SaveUsers')
        .for('staging'),
    ).toBeTruthy();
    expect(
      ACWithGrants.does('User')
        .havePermissions('SaveUsers')
        .for('prod'),
    ).toBeFalsy();
  });

  it('should have all permissions role 2 has when extending role 1', () => {
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
      },
    });
  });

  it('should not have permissions stripped if role 2 doesnt have when extending role 1', () => {
    ACWithGrants.allow('Admin').toExtend('Dev');

    // In `dev` prod is false but `admin` is true, extending `dev` should not make the value false
    expect(
      ACWithGrants.does('Admin')
        .havePermissions('SaveUsers')
        .for('prod'),
    ).toBeTruthy();
  });

  // @TODO Shouldn't this just throw an error?
  it('remove role should remove permissions as well', () => {
    ACWithGrants.remove('User');

    expect(
      ACWithGrants.does('User')
        .havePermissions('SaveUsers')
        .for('prod'),
    ).toBeFalsy();
  });

  it('should return true when calling `DoesAny` with User and Admin for SaveUser.prod', () => {
    expect(
      ACWithGrants.doesAny('User', 'Admin')
        .havePermissions('SaveUsers')
        .for('prod'),
    ).toBeTruthy();
  });

  it('should return false when calling `DoesAny` with User and Dev for SaveUser.prod', () => {
    expect(
      ACWithGrants.doesAny('User', 'Dev')
        .havePermissions('SaveUsers')
        .for('prod'),
    ).toBeFalsy();
  });

  it('should return a list of string with all roles', () => {
    expect(ACWithGrants.getRolesList()).toEqual(['User', 'Admin', 'Dev']);
  });

  it('should return a list of string with all modified roles', () => {
    ACWithGrants.grant('Test')
      .permission('GetUsers')
      .for('dev', 'staging', 'prod');

    expect(ACWithGrants.getRolesList()).toEqual([
      'User',
      'Admin',
      'Dev',
      'Test',
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
        staging: true,
        prod: false,
      },
    });
  });

  it('should throw PermissionNotFoundError', () => {
    expect(() => {
      ACWithGrants.getPermissions('Test');
    }).toThrow(PermissionNotFoundError);
  });

  it('should create a new role with new permissions even if we don`t set initial object', () => {
    ACWithoutGrants.grant('NEW_ROLE')
      .permission('NEW_PERMISSION')
      .for('dev', 'staging');

    const result = ACWithoutGrants.getRoles();
    expect(result).toHaveProperty('NEW_ROLE');
    expect(result.NEW_ROLE).toEqual({
      NEW_PERMISSION: {
        dev: true,
        prod: false,
        staging: true,
      },
    });
  });
});
