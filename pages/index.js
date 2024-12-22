import styles from "./style.module.scss";

function Home() {
  return (
    <div className={styles.home}>
      <h1 className={styles.frase}>
        A vida nos cruzou por um instante, mas marcou para sempre.
      </h1>
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
