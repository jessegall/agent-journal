import json
import os
import subprocess
from pathlib import Path

HOOK_PROGRAM_FOLDER = Path(__file__).resolve().parents[4] / "tools" / "journal-hook"
BUILD_LIMIT_SECONDS = 180
RUN_LIMIT_SECONDS = 30
SOCKET_SWITCH = "hooks-on-socket"


class HookProgram:
    """The Go hook program built into a scratch folder, run on a raw hook body against a journal folder the way an
    agent program runs it, with every process under a time limit."""

    def __init__(self, folder: Path) -> None:
        self.path = folder / "journal-hook"

    def build(self) -> None:
        subprocess.run(["go", "build", "-o", str(self.path), "."], cwd=HOOK_PROGRAM_FOLDER, check=True, timeout=BUILD_LIMIT_SECONDS, capture_output=True)

    def sent(self, journal_folder: Path, root: Path, body: dict[str, object]) -> subprocess.CompletedProcess[str]:
        (root / ".journal").symlink_to(journal_folder.resolve(), target_is_directory=True)
        (journal_folder / SOCKET_SWITCH).write_text("")
        environment = {**os.environ, "AGENT_JOURNAL_ACTIVE": "1", "JOURNAL_ENV": "main", "JOURNAL_ACTOR": "agent"}
        return subprocess.run([str(self.path), "claude", str(root)], input=json.dumps(body), text=True, capture_output=True, env=environment,
                              timeout=RUN_LIMIT_SECONDS, cwd=root)
