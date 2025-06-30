export type User = {
  id: string;
  name?: string;
  email?: string;
  picture?: string;
  token?: string; // JWT token for authenticated requests
};
