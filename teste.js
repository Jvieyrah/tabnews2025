class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

function salvarUsiário(input) {
  if (!input) {
    throw new ReferenceError("é preciso inserir um imput");
  }
  if (!input.name) {
    throw new ValidationError("Prrencha seu nome");
  }
  if (!input.username) {
    throw new ValidationError("Prrencha seu apelido");
  }
  if (!input.age) {
    throw new ValidationError("Prrencha sua idade");
  }
}

try {
  salvarUsiário({});
} catch (error) {
  if (error instanceof ReferenceError) {
    console.log(error);
  }
  if (error instanceof ValidationError) {
    console.log(error);
    return;
  }
}
