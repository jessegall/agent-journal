import json
from pathlib import Path

MANIFEST = {"name": "sample", "version": "1.0.0", "title": "Sample", "settings": {"level": {"title": "Level", "type": "number", "default": 1}}}


def sample_plugin_folder(parent: Path) -> Path:
    folder = parent / "sample-plugin"
    (folder / ".journal-plugin").mkdir(parents=True, exist_ok=True)
    (folder / ".journal-plugin" / "plugin.json").write_text(json.dumps(MANIFEST))
    (folder / "run.sh").write_text("#!/bin/sh\nexit 0\n")
    return folder
