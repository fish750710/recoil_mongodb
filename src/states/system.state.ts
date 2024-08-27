import { create } from "zustand";

type State = {
  config: null;
  setConfig: (data) => void;
  bannerList: [];
  systemConfig: Record<string, never>;
  loading: boolean;
  setLoading: (val: boolean) => void;
};
const systemState = create<State>((set) => ({
  config: null,
  setConfig: (data) => set({ config: data }),
  bannerList: [],
  systemConfig: {},
  loading: false,
  setLoading: (val) => set({ loading: val }),
}));

export default systemState;
