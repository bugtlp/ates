export interface EmployeeCreatedEvent {
  id: string;
  login: string;
  role: string;
}

export interface TaskCreatedEvent {
  id: string;
  // jira_id: jiraId,
  description: string;
  price_assignee: number;
  price_completed: number;
  assignee_id: string;
}
