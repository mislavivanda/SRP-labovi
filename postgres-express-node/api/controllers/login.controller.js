const winston = require("winston");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const config = require("../../config");
const { loginServiceInstance } = require("../../services");

const Logger = winston.loggers.get("logger");

// Setup Rate Limiter
const loginLimiter = new RateLimiterMemory(config.rateLimiter.loginPath);//TU SE NALAZE U CONFIG FILEU PARAMETRI U loginPath objektu DURATION,KREDIT I BLOCKDURATION

const tooManyRequests = (limiterRes, res) => {//POZIVAMO JE KADA PREKRDASI BROJ KREDITA
  const retrySecs = Math.round(limiterRes.msBeforeNext / 1000) || 1;
  if (retrySecs > 0) {
    res.set({ "Retry-After": retrySecs });
    return res.status(429).json({ error: { message: "Too Many Requests" } });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const loginLimiterRes = await loginLimiter.get(username);

    if (
      loginLimiterRes &&
      loginLimiterRes.consumedPoints > config.rateLimiter.loginPath.points//gledamo jesu li potroseni svi krediti za taj username prije nego krenemo provjeravat password
    ) {
      return tooManyRequests(loginLimiterRes, res);//ako su potrosenui krediti->NE RADIMO NIKAKAVE PROVJERE I UPOZORAVAMO DA NEMA VISE KREDITA->BLOKIRAJ DALJNJE REQUESTOVE
    }

    const { user, token } = await loginServiceInstance.login({//NIJE POTROSEN KREDIT
      username,
      password,
    });

    if (loginLimiterRes && loginLimiterRes.consumedPoints > 0) {
      await loginLimiter.delete(username);
    }

    return res.json({ user, token });
  } catch (err) {
    Logger.error(err);

    switch (err.name) {
      case "UsernameValidationError":
        return res.status(401).json({ error: { message: err.message } });
      case "PasswordValidationError"://KRIVI PASSWORD->SMANJI MU KREDIT->consume kredit za taj username
        try {
          await loginLimiter.consume(err.username);
          return res.status(401).json({ error: { message: err.message } });
        } catch (loginLimiterRejected) {
          if (loginLimiterRejected instanceof Error) {
            return res
              .status(400)
              .json({ error: { message: loginLimiterRejected.message } });
          } else {
            return tooManyRequests(loginLimiterRejected, res);//javija se drugi tip errora od standarnoig objekta Error
          }
        }
      default:
        return res.status(400).json({ error: { message: err.message } });
    }
  }
};
