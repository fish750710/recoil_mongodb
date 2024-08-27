import { create } from "zustand";

type State = {
  validCode: string;
  isLogin: boolean;
};
const userState = create<State>(() => ({
  isLogin: false,
  validCode: "1234",
}));

export default userState;
