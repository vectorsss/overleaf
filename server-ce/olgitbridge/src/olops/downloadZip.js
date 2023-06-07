/*
| Downloads a project as a zip file.
*/
module.exports =
	async function( client, olServer, project_id )
{
	const res = await client.get(
		olServer + '/Project/' + project_id + '/download/zip',
		{ responseType: 'arraybuffer' }
	);
	console.log("[debug] download size:", res.data.length);
	return res.data;
};
