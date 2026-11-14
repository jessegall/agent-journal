import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

RULES = ["architecture_processes_reader-saved-outside-add-reader", "architecture_processes_reader-demand-from-whole-line"]
ROOT = Path(__file__).resolve().parents[2]


def main() -> int:
    with tempfile.TemporaryDirectory(prefix="reader-detectors-") as directory:
        project = Path(directory)
        custom = project / ".commandments" / "custom"
        custom.mkdir(parents=True)
        (project / ".commandments" / "config.json").write_text(json.dumps({"paths": ["src"], "detectors": RULES}))
        for rule in RULES:
            shutil.copy2(ROOT / ".commandments" / "custom" / f"{rule}.json", custom)
        shutil.copytree(ROOT / ".commandments" / "custom" / "skills" / "processes-architecture", custom / "skills" / "processes-architecture")
        shutil.copytree(ROOT / ".commandments" / "custom" / "samples" / "reader_definitions", custom / "samples")
        return subprocess.run([sys.argv[1], "rule", "prove"], cwd=project, check=False).returncode


if __name__ == "__main__":
    raise SystemExit(main())
