

exports.login = {//definiramo kakve oblike prihvacamo od korisnika
  title: "Sign in a user",
  type: "object",
  properties: {
    username: { type: "string", minLength: 1 },
    password: { type: "string", minLength: 8 },
  },
  required: ["username", "password"],
};
