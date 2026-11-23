"""Prints each service that mounts a file or folder of the installation which is among the changed files.

The compose configuration comes as JSON on standard input. Arguments: the installation folder and a file that lists
the changed paths, relative to that folder.
"""

import json
import os
import sys

root = os.path.realpath(sys.argv[1])
changed = set(open(sys.argv[2]).read().split())

for name, service in json.load(sys.stdin)["services"].items():
    for volume in service.get("volumes", []):
        source = os.path.realpath(volume.get("source", ""))
        if volume.get("type") == "bind" and source.startswith(root + "/"):
            mounted = os.path.relpath(source, root)
            if any(path == mounted or path.startswith(mounted + "/") for path in changed):
                print(name)
                break
