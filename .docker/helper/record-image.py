"""Adds one built image to the record of built images.

Arguments: the record, then the image's name, architecture, id, Claude Code version and Codex version.
"""

import json
import sys
from datetime import datetime, timezone

path, name, architecture, reference, claude_code, codex = sys.argv[1:7]
record = json.load(open(path))
record["images"].append({
    "name": name,
    "architecture": architecture,
    "reference": reference,
    "claude_code": claude_code,
    "codex": codex,
    "built_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
})
open(path, "w").write(json.dumps(record, indent=4) + "\n")
