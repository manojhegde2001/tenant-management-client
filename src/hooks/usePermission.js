import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to handle permission checks within the application.
 */
const usePermission = () => {
  const { user } = useAuth();

  /**
   * Checks if the current user has a specific permission.
   * @param {string} permission - The permission string to check (e.g., 'WRITE_USERS').
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }
    return user.role.permissions.includes(permission);
  };

  /**
   * Checks if the user has any of the provided permissions.
   * @param {string[]} permissions - Array of permission strings.
   * @returns {boolean}
   */
  const hasAnyPermission = (permissions) => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }
    return permissions.some((perm) => user.role.permissions.includes(perm));
  };

  /**
   * Checks if the user has all of the provided permissions.
   * @param {string[]} permissions - Array of permission strings.
   * @returns {boolean}
   */
  const hasAllPermissions = (permissions) => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }
    return permissions.every((perm) => user.role.permissions.includes(perm));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole: user?.role?.name,
    permissions: user?.role?.permissions || [],
  };
};

export default usePermission;
