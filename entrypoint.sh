#!/bin/bash
set -e

api_url=https://dl.k8s.io/release/v1.26.0/bin/linux/amd64/kubectl
echo $api_url

curl -LO "${api_url}"
