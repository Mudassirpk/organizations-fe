export type TUser = {
  id: number;
  email: string;
  name: string;
  password: string;
  roleId: number;
  role: Role;
  user_organization: UserOrganization[];
  permissions: Permission[];
};

type Role = {
  id: number;
  name: string;
};

type UserOrganization = {
  organization: Organization;
};

type Organization = {
  id: number;
  name: string;
};

type Permission = {
  id: number;
  permissionId: number;
  userId: number;
  permission: PermissionDetail;
};

type PermissionDetail = {
  id: number;
  organizationId: number;
  resource: string;
  actionId: number;
  action: Action;
};

type Action = {
  id: number;
  name: string;
};
