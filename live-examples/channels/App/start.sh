#!/bin/bash

export NG_CLI_ANALYTICS="false"

npm build & npx http-server ./dist/glue42-core-channels-angular-ui
wait