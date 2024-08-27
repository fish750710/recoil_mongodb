import React, { useState, useEffect } from "react";
import "./App.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState, userStatusState, currentUserIDState } from "./store/user";
import { useStores } from "./hooks";

function App() {
  const [count, setCount] = useState(0);
  const [userList, setUserList] = useState([]);
  // recoil
  const [user, setUser] = useRecoilState(userState);
  const userData = useRecoilValue(userState);
  const userId = useRecoilValue(currentUserIDState);
  // zustand
  const { userState: userState1, systemState } = useStores();
  const validCode = userState1((state) => state.validCode);
  const loading = systemState((state) => state.loading);
  const setLoading = systemState((state) => state.setLoading);

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = () => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUserList(data))
      .catch((error) => console.error("获取用户数据时出错:", error));
  };
  const createUser = () => {
    // console.log(user, "user");
    fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => getUserList())
      .catch((error) => console.error("错误:", error));
  };

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
        onChange={(e) => {
          setUser((oldValue) => ({ ...oldValue, name: e.target.value }));
        }}
      />
      <label htmlFor="age">年龄</label>
      <input
        type="number"
        id="age"
        onChange={(e) => {
          setUser((oldValue) => ({
            ...oldValue,
            age: parseInt(e.target.value, 10),
          }));
        }}
      />
      <button onClick={createUser}>創建新用户</button>
      <button onClick={getUserList}>獲取所有用户</button>
      {userList.map((user: any) => (
        <div key={user._id} style={{ display: "flex" }}>
          <p>{user.name}</p>&emsp;
          <p>{user.age}</p>
        </div>
      ))}
    </>
  );
}

export default App;
