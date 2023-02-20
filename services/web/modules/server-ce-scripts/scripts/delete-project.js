const { reject } = require('lodash')
const { resolveConfig } = require('prettier')
const { waitForDb } = require('../../../app/src/infrastructure/mongodb')
const { db } = require('../../../app/src/infrastructure/mongodb')
const ProjectDeleter = require('../../../app/src/Features/Project/ProjectDeleter')


async function main() {
  await waitForDb()

  const project_id = (process.argv.slice(2).pop() || '').replace(/^--id=/, '')
  if (!project_id) {
    console.error(`Usage: node ${__filename} --id=111222333`)
    process.exit(1)
  }

  await new Promise((resolve, reject) => {
    console.log("deleting project:", project_id)
    ProjectDeleter.deleteProject(project_id, error => {
        if (error) {
            reject(error)
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
