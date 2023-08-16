import styles from "./index.module.less";
import WorkSpace from './WorkSpace';
import Body from './Body';

export default function App() {
  return (
    <div className={styles["page"]}>
      <div className={styles['page-left']}>
        <WorkSpace />
      </div>
      <div className={styles['page-right']}>
        <Body />
      </div>
    </div>
  );
}
