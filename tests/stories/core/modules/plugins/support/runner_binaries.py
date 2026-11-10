import sys
from pathlib import Path

from engine.journal.journal_home import JournalHome

RECORDER = f"""#!{sys.executable}
import json, os, subprocess, sys
arguments = sys.argv[1:]
line = arguments[arguments.index("--") + 1]
with open({{record!r}}, "w") as recorded:
    json.dump({{{{"arguments": arguments, "folder": os.path.realpath(os.getcwd()), "session": os.environ.get("JOURNAL_AGENT_SESSION", "")}}}}, recorded)
sys.exit(subprocess.run(["sh", "-c", line]).returncode)
"""


def runner_file(home: JournalHome) -> Path:
    binary = home.folder.resolve() / "bin" / "journal-run"
    binary.parent.mkdir(parents=True, exist_ok=True)
    binary.unlink(missing_ok=True)
    return binary


def recording_runner_at(home: JournalHome) -> Path:
    """A runner that keeps its arguments, folder and session in the file it returns, and then runs the line."""
    record = home.folder.parent / "runner-call.json"
    binary = runner_file(home)
    binary.write_text(RECORDER.format(record=str(record)))
    binary.chmod(0o755)
    return record
