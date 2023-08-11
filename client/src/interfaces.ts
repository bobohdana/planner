import { Dayjs } from "dayjs"

export interface IPlan {
  _id?: string,
  text: string,
  isCompleted?: boolean,
  author?: string,
  date: Date | Dayjs,
  time?: Date,
  subscribers?: []
}

export interface IUser {
  _id: string,
  name: string,
  email: string,
  password: string,
  plans: [IPlan],
  picture?: string,
}

export interface IAuth {
  login: (jwtToken: string, id: string) => void,
  logout: () => void,
  token: string,
  userId: string,
}

export type IRange = [number, number]