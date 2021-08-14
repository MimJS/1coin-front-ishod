const s = require(`fernet`)
const base = require(`base-64`)
const md5 = require(`md5`)

fe = (str_, key_) => {
    let op = new s.Secret(key_)
    let ff23 = new s.Token({
        secret: op,
        time: Date.parse(1),
        iv: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    })
    // HEY THIS CODE WROTE vk.com/niki_tt ( THX )
    return ff23.encode(str_)
}

encode = (rb) => {
    let now = new Date()
    let date = base.encode(md5(now.getUTCFullYear() * Number(now.getUTCMonth() + 1) * now.getUTCDate() * now.getUTCHours() * now.getUTCMinutes() + window.navigator.userAgent))

    let send_data = fe(
        JSON.stringify(rb),
        date
    )

    // HEY THIS CODE WROTE vk.com/niki_tt ( THX )

    // отправляем на сервер

    return send_data

}

module.exports = {
    e: encode
}