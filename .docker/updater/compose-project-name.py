"""Prints the name of the compose project, read from `docker compose config --format json` on standard input."""

import json
import sys

print(json.load(sys.stdin)["name"])
