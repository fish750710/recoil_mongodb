import { create } from "zustand";

type levelItem = {
  key: number;
  name: string;
};
type State = {
  vipList: null;
  levelList: levelItem[];
};
const vipState = create<State>(() => ({
  vipList: null,
  levelList: [
    { key: 0, name: "黑铁" },
    { key: 1, name: "青铜" },
    { key: 2, name: "白银" },
    { key: 3, name: "黄金" },
    { key: 4, name: "铂金" },
    { key: 5, name: "钻石" },
    { key: 6, name: "水晶" },
    { key: 7, name: "皇冠" },
    { key: 8, name: "星耀" },
    { key: 9, name: "王者" },
    { key: 10, name: "彩神" },
  ],
}));

export default vipState;
