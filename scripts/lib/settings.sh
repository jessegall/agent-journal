#!/bin/sh
# Shared by the project's shell scripts: reading and writing the settings of the .env in the folder a script runs in.
#   . scripts/lib/settings.sh

# The value .env gives a setting, or nothing.
read_setting() {
    sed -n "s/^$1=//p" .env | tail -n 1
}

# The option that turns on the arrangement's services: a contained installation also runs the contained profile.
compose_profiles() {
    [ "$(read_setting AGENTS_ARRANGEMENT)" != contained ] || echo "--profile contained"
}

# Writes a setting into .env, replacing the line that sets it or adding one.
set_setting() {
    if grep -q "^$1=" .env; then
        sed -i.previous "s|^$1=.*|$1=$2|" .env && rm -f .env.previous
    else
        printf '%s=%s\n' "$1" "$2" >> .env
    fi
}
