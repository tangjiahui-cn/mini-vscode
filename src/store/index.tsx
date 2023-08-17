import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface File {
  fileName: string; // 文件名称
  content: string; // 编辑器内容
  filePath: string; // 文件路径
}

interface operateState {
  body: {
    currentFile: File;
  };
}

const initialState: operateState = {
	body: {
    currentFile: {
      fileName: '',
      content: '',
      filePath: ''
    }
	}
};

const operateSlice = createSlice({
  name: "operate",
  initialState,
  reducers: {
    // ======================== 拖拽中变量 =======================
		setBody (state, action: PayloadAction<File>) {
      const o = action.payload;
			state.body.currentFile.content = o.content;
			state.body.currentFile.fileName = o.fileName;
      state.body.currentFile.filePath = o.filePath;
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
