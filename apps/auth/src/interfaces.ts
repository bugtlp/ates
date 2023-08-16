export interface AddEmployeeDto {
  login: string;
  password: string;
  role: string;
}

export interface Employee {
  id: string;
  login: string;
  role: string;
}
