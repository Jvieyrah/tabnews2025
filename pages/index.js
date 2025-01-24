import styles from "./style.module.scss";
import Clock from "./components/clock";

function Home() {
  return (
    <div className={styles.home}>
      <img
        src="/images/chrono.jpeg"
        className={styles.logo}
        alt="Chrono logo"
      />
      <h1 className={styles.frase}>Um instante que marca para sempre.</h1>
      <div className={styles.background}>
        <Clock />
      </div>
    </div>
  );
}

export default Home;
