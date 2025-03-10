export class InternalServerError extends Error {
  constructor({ cause, statusCode }) {
    super("Um erro inesperado aconteceu", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Entre em contato com o suporte";
    this.statusCode = statusCode || 500;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class ServiceError extends Error {
  constructor({ cause, message }) {
    super(message || "Serviço indisponivel no momento", {
      cause,
    });
    this.name = "ServiceError";
    this.action = "Verifique se o serviço está dispónivel ";
    this.statusCode = 503;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  constructor() {
    super("Um erro de método aconteceu");
    this.name = "MethodNotAllowedError";
    (this.message = "Método não permitido para este endpoint"),
      (this.action = "Verifique se o método HTTP é valido para este endpoint"),
      (this.statusCode = 405);
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
