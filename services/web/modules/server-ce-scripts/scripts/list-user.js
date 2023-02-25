const minimist = require('minimist')
const { db, waitForDb } = require('../../../app/src/infrastructure/mongodb')

async function main() {
  await waitForDb()

  await new Promise((resolve, reject) => {

    db.users.find().toArray( (error, userlist) => {
            if (error) reject(error)
            for (const u of userlist) {
                console.log(u._id, u.zjhm, u.email, u.isAdmin, u.lastLoggedIn)
            }
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
