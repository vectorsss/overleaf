const minimist = require('minimist')
const { db, waitForDb } = require('../../../app/src/infrastructure/mongodb')

async function main() {
  await waitForDb()

  await new Promise((resolve, reject) => {

    db.projects.count(
        function (err, count) {
            if (err) return reject(err);
            console.log('there are %d projects', count);
            resolve()
        }
    )

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
