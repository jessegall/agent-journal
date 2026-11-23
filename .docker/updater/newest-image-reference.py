"""Prints the reference of the image built last, read from the record of built images named as the argument."""

import json
import sys

print(json.load(open(sys.argv[1]))["images"][-1]["reference"])
