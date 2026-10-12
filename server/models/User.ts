export interface IUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string | Date;
}
