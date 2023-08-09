export interface Task {
  id: string;
  description: string;
  completed: boolean;
  price_assignee: number;
  price_completed: number;
  assignee_id: string;
}
