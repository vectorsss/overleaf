const minimist = require('minimist')
const { db, waitForDb } = require('../../../app/src/infrastructure/mongodb')
const UserRegistrationHandler = require('../../../app/src/Features/User/UserRegistrationHandler')
const UserGetter = require('../../../app/src/Features/User/UserGetter')

async function main() {
  await waitForDb()

  const argv = minimist(process.argv.slice(2), {
    string: ['email']
  })

  const {email } = argv
  if (!email) {
    console.error(`Usage: node ${__filename} --email=joe@example.com`)
    process.exit(1)
  }

  await new Promise((resolve, reject) => {

    UserGetter.getUser({ email },  function (error, user) {
        if (error) {
            return reject(error)
        }

        console.log(user._id, u.gid, user.zjhm, user.isAdmin, user.email, user.signUpDate, user.lastLoggedIn, user.lastLoginIp, user.loginCount)
        resolve()
    })

  })
}

main()
  .then(() => {
    console.error('Done.')
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
