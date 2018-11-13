import Step from './Step';

import RolesStore from '../RolesStore';

import AccessControlError from '../Errors/AccessControlError';

import rolesFixture from '../__fixtures__/roles';

describe('Step (base class)', () => {
  it('throw error if `rolesStore` is not setup when calling `checkRolesExist`', () => {
    const step: Step = new Step({}, new RolesStore());

    expect(() => {
      step.checkRolesExist();
    }).toThrow(AccessControlError);
  });

  it('to return true when calling `checkRolesExist` on a properly set `rolesStore`', () => {
    const step: Step = new Step({}, new RolesStore(rolesFixture));

    expect(() => {
      step.checkRolesExist();
    }).not.toThrow();
  });
});
