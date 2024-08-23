import { atom, selector, atomFamily, selectorFamily } from "recoil";
const userState = atom({
    key: "userState",
    default: {
        name: "hans",
        age: 18,
        status: 1,
    },
});
const userStatusState = selector({
    key: "userStatusState",
    get: ({ get }) => {
        const userStatus = get(userState);
        console.log(userStatus, "get");
        return userStatus.status === 1 ? "這是1" : "這是其他";
    },
});
const myFetchCurrentUserID = () => "abcde";
// 查詢默認值
const currentUserIDState = atom({
    key: "CurrentUserID",
    default: selector({
        key: "CurrentUserID/Default",
        get: () => myFetchCurrentUserID(),
    }),
});
// API
const fetchUserData = selector({
    key: "fetchUserData",
    get: async ({ get }) => {
        const res = await fetch("/").then((res) => res.json);
        // const [users, posts] = get(waitForAll([userState, postsState])); // 並行請求 類似 Promise.all
        // const results = get(waitForNone([userState, postsState])); Promise.allSettled
        return "data" + res;
    },
});
const userState2 = atomFamily({
    key: "userState2",
    default: async (userId) => {
        const response = await fetch(`https://api.example.com/users/${userId}`);
        const data = await response.json();
        return data;
    },
});
// 無狀態，每次都會重新計算
const userState3 = selectorFamily({
    key: "userState3",
    get: (userID) => async ({ get }) => {
        const response = await fetch(`https://api.example.com/users/${userID}`);
        const data = await response.json();
        return data;
    },
});
// 定义一个组合 selector 来并发执行多个请求
export const fetchAllDataSelector = selector({
    key: "fetchAllDataSelector",
    get: async ({ get }) => {
        const firstDataPromise = get(fetchFirstDataSelector);
        const secondDataPromise = get(fetchSecondDataSelector);
        const results = await Promise.allSettled([
            firstDataPromise,
            secondDataPromise,
        ]);
        const firstDataResult = results[0];
        const secondDataResult = results[1];
        return {
            firstData: firstDataResult.status === "fulfilled" ? firstDataResult.value : null,
            secondData: secondDataResult.status === "fulfilled" ? secondDataResult.value : null,
            errors: results
                .filter((result) => result.status === "rejected")
                .map((result) => result.reason),
        };
    },
});
export { userState, userStatusState, fetchUserData, currentUserIDState };
