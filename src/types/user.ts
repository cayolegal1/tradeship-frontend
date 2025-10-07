export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  profile_pic?: string;
  // Add other user properties as needed
}
