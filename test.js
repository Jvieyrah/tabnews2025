try {
  throw true;
} catch (error) {
  console.log(error);
  console.log(typeof error);
}
