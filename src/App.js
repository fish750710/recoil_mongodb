import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState, currentUserIDState } from "./store/user";
function App() {
    const [count, setCount] = useState(0);
    const [user, setUser] = useRecoilState(userState);
    const userData = useRecoilValue(userState);
    const userId = useRecoilValue(currentUserIDState);
    console.log(userId, "userId");
    // useEffect(() => {
    //   fetch("/api/")
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //       }
    //       return response.text(); // 先获取文本响应
    //     })
    //     .then((text) => {
    //       console.log("服务器响应:", text); // 记录原始响应
    //       return text ? JSON.parse(text) : {}; // 如果有内容才解析 JSON
    //     })
    //     .then((data) => console.log(data.message))
    //     .catch((error) => {
    //       console.error("错误:", error);
    //       // setMessage("加载失败");
    //     });
    // }, []);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { children: [user?.name, user?.age, " | ", userData.age, _jsx("a", { href: "https://vitejs.dev", target: "_blank", children: _jsx("img", { src: viteLogo, className: "logo", alt: "Vite logo" }) }), _jsx("a", { href: "https://react.dev", target: "_blank", children: _jsx("img", { src: reactLogo, className: "logo react", alt: "React logo" }) })] }), _jsx("h1", { children: "Vite + React" }), _jsxs("div", { className: "card", children: [_jsxs("button", { onClick: () => {
                            setCount((count) => count + 1);
                            setUser((oldValue) => ({ ...oldValue, age: oldValue.age + 1 }));
                        }, children: ["count is ", count] }), _jsxs("p", { children: ["Edit ", _jsx("code", { children: "src/App.tsx" }), " and save to test HMR"] })] }), _jsx("button", { onClick: () => {
                    fetch("/api/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ name: "hans", age: 18 }), // 示例数据
                    })
                        .then((res) => res.json())
                        .then((data) => console.log(data, "***"))
                        .catch((error) => console.error("错误:", error));
                }, children: "\u521B\u5EFA\u65B0\u7528\u6237" }), _jsx("button", { onClick: () => {
                    fetch("/api/users")
                        .then((res) => res.json())
                        .then((data) => console.log(data, "获取到的用户数据"))
                        .catch((error) => console.error("获取用户数据时出错:", error));
                }, children: "\u83B7\u53D6\u6240\u6709\u7528\u6237" })] }));
}
export default App;
