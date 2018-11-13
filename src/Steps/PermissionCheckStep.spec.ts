import PermissionCheckStep from './PermissionCheckStep';

import RolesStore from '../RolesStore';

import AccessControlError from '../Errors/AccessControlError';

import rolesFixture from '../__fixtures__/roles';

import { GrantQuery } from '../types';

describe('PermissionCheckStep', () => {
  it('throw error if `rolesStore` is not setup when calling `hasPermission`', () => {
    const pcs: PermissionCheckStep = new PermissionCheckStep(
      {},
      new RolesStore(),
    );

    expect(pcs.hasPermission()).toBeFalsy();
  });

  it('Simple valid query, should return true', () => {
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

  it('Bad query role, should return false', () => {
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

  it('Bad query permission without `any`, should return false', () => {
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

  it('Bad query permission with `any`, should return false', () => {
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
