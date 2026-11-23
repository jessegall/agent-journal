"""Prints the id a loaded image keeps, its config digest, read from an image archive's manifest.json on standard input."""

import json
import os
import sys

config = json.load(sys.stdin)[0]["Config"]
print("sha256:" + os.path.basename(config).removesuffix(".json"))
