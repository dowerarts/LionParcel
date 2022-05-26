var fetch = require('node-fetch');
const fs = require('fs');
const chalk = require('chalk');
const readlineSync = require('readline-sync')
const cluster = require('cluster');
const delay = require('delay');
var arguments = require('minimist')(process.argv.slice(2))
var no = 1;

const getLogin = (phoneNumber) => new Promise((resolve, reject) => {
    fetch('https://algo-api.lionparcel.com/v1/account/auth/customer/username/check?phone_number=' + phoneNumber + '', {
            headers: {
                'Host': 'algo-api.lionparcel.com',
                'Cache-Control': 'max-age=0',
                'Accept-Encoding': 'gzip, deflate',
                'User-Agent': 'okhttp/5.0.0-alpha.6'
            }
        })

        .then(res => res.text())
        .then(res => resolve(res))
        .catch(err => {
            reject(err)
        })
});

const addReffCode = (codereff) => new Promise((resolve, reject) => {
    fetch('https://algo-api.lionparcel.com/v1/account/referral_code/check?code=' + codereff + '', {
            headers: {
                'Host': 'algo-api.lionparcel.com',
                'Cache-Control': 'max-age=0',
                'Accept-Encoding': 'gzip, deflate',
                'User-Agent': 'okhttp/5.0.0-alpha.6'
            }
        })

        .then(res => res.text())
        .then(res => resolve(res))
        .catch(err => {
            reject(err)
        })
});

const sendOtp = (phoneNumber) => new Promise((resolve, reject) => {
    fetch('https://algo-api.lionparcel.com/v2/account/auth/otp/request', {
            method: 'POST',
            headers: {
                'Host': 'algo-api.lionparcel.com',
                'Cache-Control': 'max-age=0',
                'Content-Type': 'application/json; charset=UTF-8',
                'Content-Length': '96',
                'User-Agent': 'okhttp/5.0.0-alpha.6'
            },
            body: JSON.stringify({
                'messaging_type': 'SMS',
                'otp_type': 'REGISTER',
                'phone_number': '+62' + phoneNumber + '',
                'role': 'CUSTOMER'
            })
        })

        .then(res => res.text())
        .then(res => resolve(res))
        .catch(err => {
            reject(err)
        })
});


const verifOtp = (otpCodeId, otpCodeVerif) => new Promise((resolve, reject) => {
    fetch('https://algo-api.lionparcel.com/v1/account/auth/otp/exchange', {
            method: 'POST',
            headers: {
                'Host': 'algo-api.lionparcel.com',
                'Cache-Control': 'max-age=0',
                'Content-Length': '25',
                'Accept-Encoding': 'gzip, deflate',
                'User-Agent': 'okhttp/5.0.0-alpha.6'
            },
            body: new URLSearchParams({
                'otp_id': '' + otpCodeId + '',
                'otp': '' + otpCodeVerif + ''
            })
        })

        .then(res => res.text())
        .then(res => resolve(res))
        .catch(err => {
            reject(err)
        })
});

const verifRegister = (phoneNumber, tokenId, refferalCode) => new Promise((resolve, reject) => {
    fetch('https://algo-api.lionparcel.com/v3/account/auth/customer/register', {
            method: 'POST',
            headers: {
                'Host': 'algo-api.lionparcel.com',
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'User-Agent': 'LionParcelLogistics/2.24.0 (com.lionparcel.services.consumer; build:592; iOS 15.4.1) Alamofire/5.0.0',
                'Accept-Language': 'id-ID;q=1.0',
            },
            body: JSON.stringify({
                'password_confirm': 'Alfarz123!',
                'city': 8979,
                'fullName': 'apri amsyah',
                'phone_number': '+62' + phoneNumber + '',
                'token': '' + tokenId + '',
                'referral_code': '' + refferalCode + '',
                'password': 'Alfarz123!'
            })
        })

        .then(res => res.text())
        .then(res => resolve(res))
        .catch(err => {
            reject(err)
        })
});

const getNumber = (apikey) => new Promise((resolve, reject) => {
    fetch('https://smshub.org/stubs/handler_api.php?api_key=' + apikey + '&action=getNumber&service=ot&operator=any&country=6', {
            method: 'GET',
        })

        .then(res => res.text())
        .then(res => resolve(res))
        .catch(err => {
            reject(err)
        })
});

const getOtp = (apikey, statusId) => new Promise((resolve, reject) => {
    fetch('https://smshub.org/stubs/handler_api.php?api_key=' + apikey + '&action=getStatus&id=' + statusId + '', {
            method: 'GET',
        })

        .then(res => res.text())
        .then(res => resolve(res))
        .catch(err => {
            reject(err)
        })
});

const cancelOrder = (apikey, statusId) => new Promise((resolve, reject) => {
    fetch('https://smshub.org/stubs/handler_api.php?api_key=' + apikey + '&&action=setStatus&status=8&id=' + statusId + '', {
            method: 'GET',
        })

        .then(res => res.text())
        .then(res => resolve(res))
        .catch(err => {
            reject(err)
        })
});
if (cluster.isMaster) {
    // Fork workers.
    const totalReff = arguments['totalReff'];
    while (true) {
        if (totalReff == undefined) {
            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Running Again Example node run --totalReff=(u need) --reffCode=(code Refferal U)\n`)
            break;
        } else {
            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Waiting Running Bot\n`)
            break;
        }
    }
    for (let i = 0; i < totalReff; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    (async () => {
        const codeReffKamu = arguments['reffCode'];
        while (true) {
            if (codeReffKamu == undefined) {
                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Running Again Example node run --totalReff=(u need) --reffCode=(code Refferal U)\n`)
                break;
            } else {
                break;
            }
        }
        const apikey = fs.readFileSync('apikey.txt', 'UTF-8');

        for (let index = 0; index < 1; index++) {
            await delay(5000)
            const nohp = await getNumber(apikey);
            try {
                var serviceId = nohp.match('ACCESS_NUMBER:(.*?):')
                var serviceId = serviceId[1];
                var phoneNumber = nohp.match('ACCESS_NUMBER:' + serviceId + ':(.*)')
                var phoneNumber = phoneNumber[1];
            } catch (err) {
                console.log('    Failure Get Phone Number')
            }
            var phoneNumber = phoneNumber.substring(phoneNumber, 2);
            var phoneNumber = `0${phoneNumber}`;
            console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Successfully Get Phone Number ${phoneNumber} ( ${serviceId} )\n`)

            var check = await getLogin(phoneNumber);
            if (check.match('"login":false')) {
                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Phone Number Has Available ${phoneNumber}`)
            } else {
                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Phone Number Has Not Available ${phoneNumber}`)
                continue;
            }

            var addReff = await addReffCode(codeReffKamu);

            if (addReff.match('"success":true')) {
                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Successfully Added Refferal ${codeReffKamu}`)
            } else {
                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Failure Added Refferal ${codeReffKamu}`)
            }

            var phoneNumber = phoneNumber.substring(phoneNumber, 1);
            var sendCode = await sendOtp(phoneNumber)
            var memekKita = sendCode.match('"otp_id":(.*?),')
                try {
                var otpId = memekKita[1];
                } catch (err) {
                }

                if (sendCode.match('"otp_id":')) {
                    console.log(chalk.green('[')+chalk.white('!')+chalk.green(']'),`Successfully Send Otp Code (${otpId})`)
                } else {
                    console.log(chalk.green('[')+chalk.white('!')+chalk.green(']'),`Failure Send Otp Code`)
                    continue;
                }

            var time = waktu();
            start_position: while (true) {
                var getCode = await getOtp(apikey, serviceId);
                try {
                    var otp = getCode.match('STATUS_OK:Kode OTP untuk akun Lion Parcel mu adalah (.*). Mohon')
                    var otp = otp[1];
                } catch (err) {

                }

                if (!otp) {
                    if (waktu() - time > 50) {
                        const cancelnohp = await cancelOrder(apikey, serviceId);
                        console.log('    Failure Get Code 50 Second Auto Delete Order ID')
                        break;
                    } else {
                        continue start_position;
                    }
                }

                if (getCode.match('STATUS_OK:Kode OTP untuk akun Lion Parcel mu adalah (.*). Mohon')) {
                    console.log('    Code : ' + otp + '')
                    break;
                }
            }

            var create = await verifOtp(otpId, otp)
            try {
                var token = create.match('"token":"(.*?)",');
                var token = token[1];
            } catch (err) {

            }

            var register = await verifRegister(phoneNumber, token, codeReffKamu);
            if (register.match('"success":true')) {
                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Successfully Register ${phoneNumber}`)
                fs.appendFileSync("lionParcel.txt", phoneNumber + '|' + 'Alfarz123!' + '\n');
            } else {
                console.log(chalk.green('[') + chalk.white('!') + chalk.green(']'), `Failure Register ${phoneNumber}`)
            }
        }
    })();
}

function waktu() {
    var time = Math.floor(+new Date() / 1000);
    return time;
}