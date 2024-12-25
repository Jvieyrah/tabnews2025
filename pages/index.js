import styles from "./style.module.scss";
import chrono from "./chrono.jpeg";

function Home() {
  return (
    <div className={styles.home}>
      <img src={chrono} alt="Chrono logo" />
      <h1 className={styles.frase}>Um instante que marca para sempre.</h1>
    </div>
  );
}

function teste() {
  console.log("teste");
}

function test2() {
  console.log("teste2");
}

export default Home;
