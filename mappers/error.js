exports.mapErrors = function (errors) {
    const mappedErrors = {};
    errors.array().forEach((error) => {
        if (!mappedErrors[error.path]) {
            mappedErrors[error.path] = [error.msg];
        } else {
            mappedErrors[error.path].push(error.msg);
        }
    });
    return mappedErrors;
};
