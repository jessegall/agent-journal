import subprocess
import sys
import tempfile
from pathlib import Path

from core.base.journal_home import JournalHome

TOOLS_FOLDER = Path(__file__).resolve().parents[6] / "tools" / "journal-run"
BUILD_LIMIT_SECONDS = 300
RECORDER = f"""#!{sys.executable}
import json, os, subprocess, sys
arguments = sys.argv[1:]
line = arguments[arguments.index("--") + 1]
with open({{record!r}}, "w") as recorded:
    json.dump({{{{"arguments": arguments, "folder": os.path.realpath(os.getcwd()), "session": os.environ.get("JOURNAL_AGENT_SESSION", "")}}}}, recorded)
sys.exit(subprocess.run(["sh", "-c", line]).returncode)
"""


class BuiltRunner:
    """The real runner of the journal, built once per test process."""

    path: Path | None = None

    @classmethod
    def built(cls) -> Path:
        if cls.path is None:
            program = Path(tempfile.mkdtemp(prefix="story-runner-")) / "journal-run"
            finished = subprocess.run(["go", "build", "-o", str(program), "."], cwd=TOOLS_FOLDER, capture_output=True, text=True, timeout=BUILD_LIMIT_SECONDS)
            assert finished.returncode == 0, finished.stderr
            cls.path = program
        return cls.path


def runner_file(home: JournalHome) -> Path:
    binary = home.folder.resolve() / "bin" / "journal-run"
    binary.parent.mkdir(parents=True, exist_ok=True)
    binary.unlink(missing_ok=True)
    return binary


def real_runner_at(home: JournalHome) -> None:
    runner_file(home).symlink_to(BuiltRunner.built())


def recording_runner_at(home: JournalHome) -> Path:
    """A runner that keeps its arguments, folder and session in the file it returns, and then runs the line."""
    record = home.folder.parent / "runner-call.json"
    binary = runner_file(home)
    binary.write_text(RECORDER.format(record=str(record)))
    binary.chmod(0o755)
    return record
