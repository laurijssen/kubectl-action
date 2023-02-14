const http = require('https');
const fs = require('fs');
const core = require('@actions/core');
//const github = require('@actions/github');

try {
  const version = core.getInput('kubectl-version');

  console.log(`Installing kubectl version ${version}`)
  const kubectl = downloadKubectl(version)

  if (!kubectl) {
      console.log(`kubectl not correctly downloaded version: ${version}`)
  }

  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}

// could be 
function downloadKubectl(version) {
	const url = `https://dl.k8s.io/release/${version}/bin/linux/amd64/kubectl`
	const hashUrl = `${url}.sha256`

	console.log(`Downloading kubectl (${url})`)
	console.log(`Downloading kubectl checksum (${hashUrl})`)

	const file = fs.createWriteStream('kubectl.hash');

	http.get(hashUrl, (response) => {
	  response.pipe(file);
	}).on('error', (error) => {
	  console.error(error);
	});	
	
	file = fs.createWriteStream('/usr/local/kubectl')

	http.get(url, (response) => {
	  response.pipe(file);
	}).on('error', (error) => {
	  console.error(error);
	});	
	
	const hashStream = createHash('sha256')
	const { body, headers } = response
	const size = Number(headers.get('content-length'))
	console.log(`Downloaded kubectl (${size} bytes)`)
}
