export type LoginRequest = {
  username_or_phone_number: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type RegisterRequest = {
  username: string;
  full_name: string;
  phone_number: string;
  password: string;
};

export type RegisterResponse = {
  user_id: string;
  username: string;
  full_name: string;
  phone_number: string;
};

export type CurrentLoggedInUserResponse = {
  user_id: string;
  username: string;
  full_name: string;
  phone_number: string;
};
