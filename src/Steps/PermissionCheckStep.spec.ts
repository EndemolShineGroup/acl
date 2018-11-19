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

    const pcs = getPermissionCheckStep(query);

    expect(pcs.hasPermission()).toBeTruthy();
  });

  it('should return false when passing a bad query role, ', () => {
    const query: GrantQuery = {
      roles: ['A_FAKE_ROLE'],
      permissions: ['GetUsers'],
      environments: ['dev'],
      any: false,
    };

    const pcs = getPermissionCheckStep(query);

    expect(pcs.hasPermission()).toBeFalsy();
  });

  it('should return false when passing a bad query permission without `any`', () => {
    const query: GrantQuery = {
      roles: ['Admin'],
      permissions: ['A_FAKE_ROLE'],
      environments: ['dev'],
      any: false,
    };

    const pcs = getPermissionCheckStep(query);

    expect(pcs.hasPermission()).toBeFalsy();
  });

  it(' should return false when passing a bad query permission with `any`', () => {
    const query: GrantQuery = {
      roles: ['Admin'],
      permissions: ['A_FAKE_ROLE'],
      environments: ['dev'],
      any: true,
    };

    const pcs = getPermissionCheckStep(query);

    expect(pcs.hasPermission()).toBeFalsy();
  });

  describe('roleHasPermissionInEnvironment', () => {
    it('should return true if role does have permission in environment', () => {
      const pcs = new PermissionCheckStep({}, new RolesStore(rolesFixture));
      expect(
        pcs.roleHasPermissionInEnvironment(
          rolesFixture['Dev'],
          'GetUsers',
          'dev',
          'Dev',
        ),
      ).toBeTruthy();
    });

    it('should return false if role does NOT have permission in environment', () => {
      const pcs = new PermissionCheckStep({}, new RolesStore(rolesFixture));
      expect(
        pcs.roleHasPermissionInEnvironment(
          rolesFixture['Dev'],
          'GetUsers',
          'prod',
          'Dev',
        ),
      ).toBeTruthy();
    });
  });

  describe('roleHasPermissionInEveryEnvironment', () => {
    it('should return true if role does have permission in every environment', () => {
      const pcs = new PermissionCheckStep({}, new RolesStore(rolesFixture));
      expect(
        pcs.roleHasPermissionInEveryEnvironment(
          rolesFixture['Dev'],
          'SaveUsers',
          ['dev', 'staging'],
          'Dev',
        ),
      ).toBeTruthy();
    });

    it('should return false if role does NOT have permission in every environment', () => {
      const pcs = new PermissionCheckStep({}, new RolesStore(rolesFixture));
      expect(
        pcs.roleHasPermissionInEveryEnvironment(
          rolesFixture['Dev'],
          'SaveUsers',
          ['dev', 'staging', 'prod'],
          'Dev',
        ),
      ).toBeFalsy();
    });

    it('should return true if role does have permission in one of the environments and "any" is set', () => {
      const pcs = new PermissionCheckStep(
        { any: true },
        new RolesStore(rolesFixture),
      );
      expect(
        pcs.roleHasPermissionInEveryEnvironment(
          rolesFixture['Dev'],
          'SaveUsers',
          ['dev', 'staging', 'prod'],
          'Dev',
        ),
      ).toBeTruthy();
    });
  });

  describe('roleHasEveryPermission', () => {
    it('should return true if role does have every permission in every environment', () => {
      const pcs = new PermissionCheckStep({}, new RolesStore(rolesFixture));
      expect(
        pcs.roleHasEveryPermission(
          'Dev',
          ['SaveUsers', 'GetUsers'],
          ['dev', 'staging'],
        ),
      ).toBeTruthy();
    });

    it('should return false if role does NOT have every permission in every environment', () => {
      const pcs = new PermissionCheckStep({}, new RolesStore(rolesFixture));
      expect(
        pcs.roleHasEveryPermission(
          'Dev',
          ['SaveUsers', 'GetUsers'],
          ['dev', 'staging', 'prod'],
        ),
      ).toBeFalsy();
    });

    it('should return true if role does have one of the permissions in at least one of the environments when "any" is set', () => {
      const pcs = new PermissionCheckStep(
        { any: true },
        new RolesStore(rolesFixture),
      );
      expect(
        pcs.roleHasEveryPermission(
          'Dev',
          ['SaveUsers', 'GetUsers'],
          ['dev', 'staging', 'prod'],
        ),
      ).toBeTruthy();
    });
  });
});

const getPermissionCheckStep = (query: GrantQuery) => {
  return new PermissionCheckStep(query, new RolesStore(rolesFixture));
};
