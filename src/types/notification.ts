export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  marked_as_read: boolean;
  created_at: string;
  // Add other notification properties as needed
}
