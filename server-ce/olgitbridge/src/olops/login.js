/*
| Performs a login.
|
| ~client: axios handle with proper tough cookie jar support
| ~olServer: overleaf server to connect to
| ~email: email to login as
| ~password: password to login as
*/
module.exports =
	async function( client, olServer, email, password )
{
	const res = await client.get( olServer + '/login' );
	const data = res.data;
	const regexCSRF = /input name="_csrf" type="hidden" value="([^"]*)">/;
	// const csrf = data.match( regexCSRF )[ 1 ];

	const regexMETA = /<meta name="ol-csrfToken" content="([^"]*)"/;
	const csrf = res.data.match( regexMETA )[ 1 ];

	await client.post(
		olServer + '/login',
		{ _csrf: csrf, email: email, password: password }
	);
};
