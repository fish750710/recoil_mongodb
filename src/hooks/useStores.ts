// import { create } from "zustand";
import * as states from "../states/index";

export const useStores = () => {
  return { ...states };
};

// export const useStores1 = create(() => {
//   const stores = Object.keys(states).reduce((acc, key) => {
//     acc[key] = states[key];
//     return acc;
//   }, {});
//   return { ...stores };
// });

// console.log(useStores, "useStores", useStores1);

// 這是鏡像，無法監聽狀態render
// export const useStores = create(() => ({
//   userState: states.userState.getState(),
//   vipState: states.vipState.getState(),
//   systemState: states.systemState.getState(),
// }));
