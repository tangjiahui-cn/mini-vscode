import styles from "./index.module.less";
import {useEffect, useState} from "react";
import moment from 'moment';

export default function Empty () {
  const [time, setTime] = useState<string>(getTime())

  function getTime () {
    return moment().format('HH:mm:ss')
  }

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(getTime())
    }, 1000)

    return () => clearInterval(timerId)
  }, [])

  return (
    <div className={styles['empty']}>
      <div>mini - vscode</div>
      <div className={styles['empty-time']}>{time}</div>
    </div>
  )
}