import { addPath, debug, getInput, saveState, setFailed, warning } from '@actions/core'

const core = require('@actions/core');
const github = require('@actions/github');

try {
  const version = core.getInput('kubectl-version');

  console.log(`Installing kubectl version ${version}`)
  const kubectl = downloadKubectl(version)

  if (!kubectl) {
      console.log(`kubectl not correctly downloaded version: ${version}`)
      return
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
	debug(`Downloading kubectl checksum (${hashUrl})`)

	const hashResponse = fetch(hashUrl)
	if (!hashResponse.ok) {
		debug(`Failed to download kubectl checksum with status ${hashResponse.status}`)
		warning(`Skipping checksum verification for kubectl ${version}`)
	}

	const hash = hashResponse.ok ? hashResponse.text() : ''

	const response = fetch(url)
	if (!response.ok || !response.body) {
		debug(`Failed to download kubectl with status ${response.status}`)
		setFailed(`Failed to download kubectl with status ${response.status}`)
		return
	}

	const hashStream = createHash('sha256')
	const { body, headers } = response
	const size = Number(headers.get('content-length'))
	debug(`Downloaded kubectl (${size} bytes)`)
}