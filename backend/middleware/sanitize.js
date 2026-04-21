import mongoSanitize from "mongo-sanitize";


// 🔥 Sanitize BODY (POST, PUT)
export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize(req.body);
  }
  next();
};


// 🔥 Sanitize QUERY (GET)
export const sanitizeQuery = (req, res, next) => {
  if (req.query) {
    req.query = mongoSanitize(req.query);
  }
  next();
};


// 🔥 Sanitize PARAMS (URL params)
export const sanitizeParams = (req, res, next) => {
  if (req.params) {
    req.params = mongoSanitize(req.params);
  }
  next();
};