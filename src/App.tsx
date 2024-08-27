import React, { useState, useEffect } from "react";
import "./App.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { useStores } from "./hooks";
import { userState, currentUserIDState } from "./store/user";

function App() {
  const [count, setCount] = useState(0);
  // recoil
  const [user, setUser] = useRecoilState(userState);
  const userData = useRecoilValue(userState);
  const userId = useRecoilValue(currentUserIDState);
  // zustand
  const { userState: userState1, systemState } = useStores();
  const validCode = userState1((state) => state.validCode);
  const userList = userState1((state) => state.userList);
  const getUserList = userState1((state) => state.getUserList);
  const createUser = userState1((state) => state.createUser);
  const deleteUser = userState1((state) => state.deleteUser);
  const loading = systemState((state) => state.loading);
  const setLoading = systemState((state) => state.setLoading);

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <>
      <div>
        <h3>zustand</h3>
        validCode: {validCode}
        <br />
        Loading: {loading ? "true" : "false"}
        <br />
        <button onClick={() => setLoading(!loading)}>update data</button>
      </div>
      <div className="card">
        <h3>recoil</h3>
        <h4>userId: {userId}</h4>
        <h5>
          {user?.name}
          {user?.age} | {userData.age}
        </h5>
        <button
          onClick={() => {
            setCount((count) => count + 1);
            setUser((oldValue) => ({ ...oldValue, age: oldValue.age + 1 }));
          }}
        >
          count is {count}
        </button>
      </div>
      <label htmlFor="name">用户名</label>
      <input
        type="text"
        id="name"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setUser((oldValue) => ({ ...oldValue, name: e.target.value }));
        }}
      />
      <label htmlFor="age">年龄</label>
      <input
        type="number"
        id="age"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setUser((oldValue) => ({
            ...oldValue,
            age: parseInt(e.target.value, 10),
          }));
        }}
      />
      <button onClick={() => createUser(user)}>創建新用户</button>
      <button onClick={getUserList}>獲取所有用户</button>
      {userList.map((user) => (
        <div
          key={user._id}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <p>{user.name}</p>&emsp;
          <p>{user.age}</p>
          <button onClick={() => deleteUser(user._id)}>刪除</button>
        </div>
      ))}
    </>
  );
}

export default App;
