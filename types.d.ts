export type TUser = {
  id: number;
  email: string;
  name: string;
  password: string | null;
  plan: "FREE" | "PREMIUM" | "ENTERPRISE"; // You can refine the possible values for `plan` if needed.
  lastLogin: string | null;
  createdAt: string; // ISO date string
  user_organization: Array<TUserOrganization>;
};

export type TUserOrganization = {
  id: number;
  userId: number;
  organizationId: number;
  roleId: number;
  createdAt: string; // ISO date string
  organization: TOrganization;
};

export type TOrganization = {
  id: number;
  name: string;
  userOrgId: string;
  createdAt: string;
};

export type TResource = {
  id: number;
  name: string;
  organizationId: number;
  createdAt: string; // ISO date string
  attributes: Array<TResourceAttribute>;
  resource_atom: Array<any>; // If you know the structure, replace `any` with a proper type.
};

export type TResourceAttribute = {
  id: number;
  name: string;
  type: "ALPHANUM" | "MEDIA"; // Extend with valid `type` values if needed
  resourceId: number;
};

export type TResourceAtom = {
  id: number;
  data: Record<string, string>; // A dynamic object with string keys and values
  resourceId: number;
};