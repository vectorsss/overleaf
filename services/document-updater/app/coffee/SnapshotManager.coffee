{db, ObjectId} = require "./mongojs"

module.exports = SnapshotManager =
  recordSnapshot: (project_id, doc_id, version, lines, ranges, callback) ->
    try
      project_id = ObjectId(project_id)
      doc_id = ObjectId(doc_id)
    catch error
      return callback(error)
    db.docSnapshots.insert {
      project_id, doc_id, version, lines
      ranges: SnapshotManager.jsonRangesToMongo(ranges),
      ts: new Date()
    }, callback

  jsonRangesToMongo: (ranges) ->
    return null if !ranges?
    
    updateMetadata = (metadata) ->
      if metadata?.ts?
        metadata.ts = new Date(metadata.ts)
      if metadata?.user_id?
        metadata.user_id = SnapshotManager._safeObjectId(metadata.user_id)
    
    for change in ranges.changes or []
      change.id = SnapshotManager._safeObjectId(change.id)
      updateMetadata(change.metadata)
    for comment in ranges.comments or []
      comment.id = SnapshotManager._safeObjectId(comment.id)
      if comment.op?.t?
        comment.op.t = SnapshotManager._safeObjectId(comment.op.t)
      updateMetadata(comment.metadata)
    return ranges

  _safeObjectId: (data) ->
    try
      return ObjectId(data)
    catch error
      return data
