import {useEffect} from "react";

/**
 * 同时按下按键hooks （会产生闭包）
 */
export function useDownKeys (options: {
  keys: string[]; // 监听按键
  callback: () => void; // 回调函数
}[]) {
  useEffect(() => {
    const downKeys: { [k: string]: boolean } = {};

    function handleKeyDown (e) {
      const key = e.key.toLowerCase()
      downKeys[key] = true;

      options.forEach((x) => {
        if (!x.keys.find(key => !downKeys[key])) {
          x.callback();
        }
      })
    }

    function handleKeyUp (e) {
      const key = e.key.toLowerCase()
      delete downKeys[key];
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
}
