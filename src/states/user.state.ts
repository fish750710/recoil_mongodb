import { create } from "zustand";

const baseUrl = "/api/users";

interface User {
  _id: string;
  name: string;
  age: number;
}

type State = {
  validCode: string;
  isLogin: boolean;
  userList: User[];
  setUserList: (data: User[]) => void;
  getUserList: () => void;
  createUser: (data) => void;
  deleteUser: (id: string) => void;
};
const userState = create<State>((set, get) => ({
  isLogin: false,
  validCode: "1234",
  userList: [],
  setUserList: (data) => set({ userList: data }),
  getUserList: async () => {
    try {
      const res: User[] = await fetch(`${baseUrl}/getUsers`).then((res) =>
        res.json()
      );
      set({ userList: res });
    } catch (error) {
      console.error("err", error);
    }
  },
  createUser: async (userData) => {
    try {
      await fetch(`${baseUrl}/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }).then((res) => res.json());
      get().getUserList();
    } catch (error) {
      console.error("err", error);
    }
  },
  deleteUser: async (id) => {
    try {
      const res = await fetch(`${baseUrl}/deleteUser/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        get().getUserList();
        return;
      }
      // 刪除失敗
      const errorMessage = await res.json();
      console.error("Error:", errorMessage.message);
    } catch (error) {
      console.error("err", error);
    }
  },
}));

export default userState;
