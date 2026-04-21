export interface University {
  id: number;
  name: string;
  short: string;
  loc: string;
  city: string;
  reg: string;
  est: string;
  about: string;
  tag: string;
  img: string;
  logo: string | null;
  schools: School[];
}

export interface FormField {
  key: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
}

export interface Requirement {
  label: string;
  amount: number;
}

export interface School {
  id: number;
  universityId: number;
  n: string;
  t: string;
  acr: string | null;
  i: string | null;
  departments: string[];
  formFields: FormField[];
  schoolRequirements: Requirement[];
}

export interface Application {
  id: number;
  userId: number;
  schoolId: number;
  personalInfo: Record<string, any>;
  requirementsChecked: Requirement[];
  totalFee: number;
  createdAt: Date;
  school?: School;
  user?: User;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  academicBackground: string;
  createdAt: Date;
}
