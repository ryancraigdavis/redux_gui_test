#!/usr/bin/env bash
set -euo pipefail

# node_modules is a container-local volume so it never collides with the host; volumes start
# root-owned, so make it writable before installing.
sudo chown "$(id -u):$(id -g)" node_modules

npm ci
