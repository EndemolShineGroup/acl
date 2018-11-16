import rolesFixture from '../__fixtures__/roles';
import AccessControlError from '../Errors/AccessControlError';
import RolesStore from '../RolesStore';
import { GrantQuery } from '../types';
import PermissionCheckStep from './PermissionCheckStep';

describe('PermissionCheckStep', () => {
  it('should throw error if `rolesStore` is not setup when calling `hasPermission`', () => {
    const pcs: PermissionCheckStep = new PermissionCheckStep(
      {},
      new RolesStore(),
    );

    expect(pcs.hasPermission()).toBeFalsy();
  });

  it('should return true when passing a simple valid query', () => {
    const query: GrantQuery = {
      roles: ['Admin'],
      permissions: ['GetUsers'],
      environments: ['dev'],
      any: false,
    };

    const pcs: PermissionCheckStep = new PermissionCheckStep(
      query,
      new RolesStore(rolesFixture),
    );

    expect(pcs.hasPermission()).toBeTruthy();
  });

  it('should return false when passing a bad query role, ', () => {
    const query: GrantQuery = {
      roles: ['A_FAKE_ROLE'],
      permissions: ['GetUsers'],
      environments: ['dev'],
      any: false,
    };

    const pcs: PermissionCheckStep = new PermissionCheckStep(
      query,
      new RolesStore(rolesFixture),
    );

    expect(pcs.hasPermission()).toBeFalsy();
  });

  it('should return false when passing a bad query permission without `any`', () => {
    const query: GrantQuery = {
      roles: ['Admin'],
      permissions: ['A_FAKE_ROLE'],
      environments: ['dev'],
      any: false,
    };

    const pcs: PermissionCheckStep = new PermissionCheckStep(
      query,
      new RolesStore(rolesFixture),
    );

    expect(pcs.hasPermission()).toBeFalsy();
  });

  it(' should return false when passing a bad query permission with `any`', () => {
    const query: GrantQuery = {
      roles: ['Admin'],
      permissions: ['A_FAKE_ROLE'],
      environments: ['dev'],
      any: true,
    };

    const pcs: PermissionCheckStep = new PermissionCheckStep(
      query,
      new RolesStore(rolesFixture),
    );

    expect(pcs.hasPermission()).toBeFalsy();
  });
});
