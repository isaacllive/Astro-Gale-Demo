import { login } from './login';
import { logout } from './logout';
import { register } from './register';
import { createUser, deleteUser, getUser, updateUser } from './users';
import { createPerson, deletePerson, getPerson, updatePerson } from './persons';
import { createCatalog, deleteCatalog, getCatalog, updateCatalog } from './catalogs';
import { createAssignment, deleteAssignment, getAssignment, updateAssignment } from './assignments';
import { createPermission, deletePermission, getPermission, updatePermission } from './permissions';
import { createPermissionDef, deletePermissionDef, getPermissionDef, updatePermissionDef } from './permission-defs';
import { createPermissionAssigned, deletePermissionAssigned, getPermissionAssigned, updatePermissionAssigned } from './permission-assigned';
import { createRole, deleteRole, getRole, updateRole } from './roles';
import { createServiceRequest, deleteServiceRequest, getServiceRequest, updateServiceRequest } from './service-requests';
import { getProfile, updateProfile, changePassword } from './profile';
import { createNotification, getNotifications, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } from './notifications';

export const server = {
    login,
    logout,
    register,
    getUser,
    updateUser,
    deleteUser,
    createUser,
    getPerson,
    updatePerson,
    deletePerson,
    createPerson,
    getCatalog,
    createCatalog,
    updateCatalog,
    deleteCatalog,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getPermission,
    createPermission,
    updatePermission,
    deletePermission,
    getPermissionDef,
    createPermissionDef,
    updatePermissionDef,
    deletePermissionDef,
    getPermissionAssigned,
    createPermissionAssigned,
    updatePermissionAssigned,
    deletePermissionAssigned,
    getRole,
    updateRole,
    deleteRole,
    createRole,
    getServiceRequest,
    updateServiceRequest,
    deleteServiceRequest,
    createServiceRequest,
    getProfile,
    updateProfile,
    changePassword,
    createNotification,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
