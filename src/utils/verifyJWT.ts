import { jwtDecode } from "jwt-decode";

export const verifyJWT = <T>(token: string): T => {
  const decoded = jwtDecode<T>(token);

  return decoded;
};
