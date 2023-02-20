const minimist = require('minimist')
const { db, waitForDb } = require('../../../app/src/infrastructure/mongodb')
const UserRegistrationHandler = require('../../../app/src/Features/User/UserRegistrationHandler')
const UserGetter = require('../../../app/src/Features/User/UserGetter')
const ProjectGetter = require('../../../app/src/Features/Project/ProjectGetter')
const { Project } = require('../../../app/src/models/Project')

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

        let id = user._id
        ProjectGetter.findAllUsersProjects(user._id, {"name": 1, "active": 1, "lastUpdated": 1},function (error, ownedProjects){
            if (error) {
                return reject(error)
            }
            console.log(ownedProjects)
            resolve()
        })
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
