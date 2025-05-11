import styles from "./style.module.scss";
import Clock from "./components/clock";
import Image from "next/image";

function Home() {
  return (
    <div className={styles.home}>
      <Image
        src="/images/chrono.jpeg"
        width={230}
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
