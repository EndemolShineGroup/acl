import RolesStore from '../RolesStore';

export default function RolesResolver(
  rolesStore: RolesStore,
  roles: string[],
): string[] {
  if (roles.length === 1 && roles[0] === '*') {
    return rolesStore.getRolesList();
  }

  return roles;
}
