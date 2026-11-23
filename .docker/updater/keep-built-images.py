"""Adds to the commit's record of built images the rows an earlier record holds and it lacks.

An image built and checked on this server stays verified across installs. Arguments: the earlier record, which may
be missing, and the commit's record.
"""

import json
import os
import sys

earlier, record_path = sys.argv[1], sys.argv[2]
kept = json.load(open(earlier))["images"] if os.path.exists(earlier) else []
record = json.load(open(record_path))
record["images"] += [row for row in kept if row not in record["images"]]
open(record_path, "w").write(json.dumps(record, indent=4) + "\n")
