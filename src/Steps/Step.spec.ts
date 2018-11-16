import rolesFixture from '../__fixtures__/roles';
import AccessControlError from '../Errors/AccessControlError';
import RolesStore from '../RolesStore';
import Step from './Step';

describe('Step (base class)', () => {
  it('should throw error if `rolesStore` is not setup when calling `checkRolesExist`', () => {
    const step: Step = new Step({}, new RolesStore());

    expect(() => {
      step.checkRolesExist();
    }).toThrow(AccessControlError);
  });

  it('should return true when calling `checkRolesExist` on a properly set `rolesStore`', () => {
    const step: Step = new Step({}, new RolesStore(rolesFixture));

    expect(() => {
      step.checkRolesExist();
    }).not.toThrow();
  });
});
