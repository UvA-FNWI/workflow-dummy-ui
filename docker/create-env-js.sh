#!/bin/bash

required_vars=( ENDPOINT, OIDC_AUTHORITY, OIDC_CLIENT_ID )
for envname in ${required_vars[@]}; do
    if [ -z ${!envname+x} ]; then
        echo "Environment variable ${envname} is not set"
        exit 1
    fi
done

cd /usr/share/nginx/html
envsubst < env.js.dist > env.js