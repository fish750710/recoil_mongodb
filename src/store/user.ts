import { atom, selector, waitForAll, atomFamily, selectorFamily } from "recoil";

interface UserState {
  name: string;
  age: number;
  status: number;
}

const userState = atom<UserState>({
  key: "userState",
  default: {
    name: "hans",
    age: 18,
    status: 1,
  },
});

const userStatusState = selector<string>({
  key: "userStatusState",
  get: ({ get }) => {
    const userStatus = get(userState);
    console.log(userStatus, "get");

    return userStatus.status === 1 ? "這是1" : "這是其他";
  },
});

const myFetchCurrentUserID = (): string => "abcde";

const currentUserIDState = atom<string>({
  key: "CurrentUserID",
  default: selector({
    key: "CurrentUserID/Default",
    get: () => myFetchCurrentUserID(),
  }),
});

const fetchUserData = selector<string>({
  key: "fetchUserData",
  get: async ({ get }) => {
    const res = await fetch("/").then((res) => res.json());
    return "data" + res;
  },
});

interface UserData {
  id: string;
  name: string;
  // 其他属性...
}

const userState2 = atomFamily<UserData, string>({
  key: "userState2",
  default: async (userId: string) => {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    const data: UserData = await response.json();
    return data;
  },
});

const userState3 = selectorFamily<UserData, string>({
  key: "userState3",
  get: (userID: string) => async ({ get }) => {
    const response = await fetch(`https://api.example.com/users/${userID}`);
    const data: UserData = await response.json();
    return data;
  },
});

interface FetchResult {
  firstData: any | null;
  secondData: any | null;
  errors: Error[];
}

export const fetchAllDataSelector = selector<FetchResult>({
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
        .filter((result): result is PromiseRejectedResult => result.status === "rejected")
        .map((result) => result.reason),
    };
  },
});

export { userState, userStatusState, fetchUserData, currentUserIDState };
