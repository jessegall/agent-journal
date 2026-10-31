import json
import subprocess
from pathlib import Path

from tests.stories.server.support.go_build import GoBuild

RUN_TIMEOUT_SECONDS = 30
SOCKET_SWITCH = "hooks-on-socket"


class HookProgram:
    """The Go hook program built into a story's folder, run on a raw hook body against the story's journal the way
    an agent program runs it, from a project folder whose .journal is the story's journal."""

    def __init__(self, journal_folder: Path) -> None:
        self.journal_folder = journal_folder
        self.binary = GoBuild.built("journal-hook", journal_folder.parent / "journal-hook")
        self.root = journal_folder.parent / "project"

    def sent(self, body: dict[str, object]) -> subprocess.CompletedProcess[str]:
        if not self.root.exists():
            self.root.mkdir()
            (self.root / ".journal").symlink_to(self.journal_folder.resolve(), target_is_directory=True)
            (self.journal_folder / SOCKET_SWITCH).write_text("")
        environment = GoBuild.environment(AGENT_JOURNAL_ACTIVE="1", JOURNAL_ENV="main", JOURNAL_ACTOR="agent")
        return subprocess.run([str(self.binary), "claude", str(self.root)], input=json.dumps({**body, "cwd": str(self.root)}), text=True,
                              capture_output=True, env=environment, timeout=RUN_TIMEOUT_SECONDS, cwd=self.root)
