export interface Task {
  id: string;
  jira_id: string;
  description: string;
  completed: boolean;
  price_assignee: number;
  price_completed: number;
  assignee_id: string;
}

export type NewTask = Omit<Task, 'id' | 'completed'>;

export interface AddTaskDto {
  jiraId: string;
  description: string;
}

export interface EmployeeCreatedEvent {
  id: string;
  login: string;
  role: string;
}
