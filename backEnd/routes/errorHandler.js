const errorHandler = function errorHandle(message, status = 500) {
  let errMsg = { statusCode: status, message: "" };
  if (message.includes("user_")) {
    const matched = message.match(/user: "(.*?)"/);
    const takenUser = matched ? matched[1] : "Unknown";
    errMsg.message = `'${takenUser}' is already taken!`;
  } else if (message.includes("email_")) {
    const matched = message.match(/email: "(.*?)"/);
    const takenEmail = matched ? matched[1] : "Unknown";
    errMsg.message = `'${takenEmail}' is already taken`;
  } else {
    errMsg.message = message || "Unknown Error!";
  }
  // console.log("error:", errMsg);
  return errMsg;
};

export default errorHandler;
