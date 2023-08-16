import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

// 编辑器内容
interface Body {
  fileName: string; // 文件名称
  content: string; // 编辑器内容
  filePath: string; // 文件路径
}

interface operateState {
  body: Body;
}

const initialState: operateState = {
	body: {
    fileName: '',
		content: '',
    filePath: ''
	}
};

const operateSlice = createSlice({
  name: "operate",
  initialState,
  reducers: {
    // ======================== 拖拽中变量 =======================
		setBody (state, action: PayloadAction<Body>) {
      const o = action.payload;
			state.body.content = o.content;
			state.body.fileName = o.fileName;
      state.body.filePath = o.filePath;
		}
  },
});

const store = configureStore({
  reducer: {
    operate: operateSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const operateActions = operateSlice.actions;
export default function AppProvider(props: {children: any}) {
  return <Provider store={store}>{props?.children}</Provider>
}
