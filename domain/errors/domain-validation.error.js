class DomainValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "DomainValidationError";
  }
}

module.exports = DomainValidationError;