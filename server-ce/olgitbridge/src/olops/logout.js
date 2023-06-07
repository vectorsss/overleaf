/*
| Logs out a ol session.
*/
module.exports =
	async function( client, olServer )
{
	const res = await client.get( olServer + "/project" );
	const regexCSRF = /input name="_csrf" type="hidden" value="([^"]*)">/;
	let csrf = res.data.match( regexCSRF )[ 1 ];
	// const regexMETA = /<meta name="ol-csrfToken" content="([^"]*)"/;
	// const csrf = res.data.match( regexMETA )[ 1 ];
	try{
		await client.post( olServer + '/logout', { '_csrf': csrf } );
	} catch (err) {
		console.log("[error]", err)
	}
};
