import React, { useState, useEffect } from "react";
import "./App.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState, userStatusState, currentUserIDState } from "./store/user";

function App() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useRecoilState(userState);
  const userData = useRecoilValue(userState);
  const userId = useRecoilValue(currentUserIDState);
  const [userList, setUserList] = useState([]);

  console.log(userId, "userId");

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
        {user?.name}
        {user?.age} | {userData.age}
      </div>
      <div className="card">
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
      <button onClick={createUser}>创建新用户</button>
      <button onClick={getUserList}>获取所有用户</button>
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
