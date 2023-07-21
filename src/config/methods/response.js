const useSuccessResponse = async (res, message, data, statusCode) => {
    console.log(statusCode, message, data);
    return await res.status(statusCode).json({
        message,
        success: true,
        data,
    })
}
const useErrorResponse = async (res, message, statusCode) => {
    console.log(message, statusCode)
    return await res.status(statusCode).json({
        success: false,
        message,
    }
    )
}
module.exports = {
    useErrorResponse,
    useSuccessResponse
}