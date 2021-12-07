import moment from "moment-timezone"

export default (timestamp, timezone, customFormat) => {
    const tz = timezone ? timezone : "Asia/Taipei"
    const format = customFormat ? customFormat : "MMM D, YYYY"
    return moment(timestamp).tz(tz).format(format)
}