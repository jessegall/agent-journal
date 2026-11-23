#!/bin/sh
# Shared by the project's shell scripts: text a script needs comes from a template file, never from the script itself.
#   . scripts/lib/templates.sh

# Prints a template file with each {{name}} replaced by the value given as name=value.
fill_template() {
    template=$1
    shift
    text=$(cat "$template")
    for pair in "$@"; do
        text=$(printf '%s' "$text" | sed "s|{{${pair%%=*}}}|$(literal_for_sed "${pair#*=}")|g")
    done
    printf '%s\n' "$text"
}

# A value written so sed puts it in as it is.
literal_for_sed() {
    printf '%s' "$1" | sed 's/[\\&|]/\\&/g'
}
