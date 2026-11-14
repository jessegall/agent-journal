import re
from collections.abc import Sequence
from pathlib import Path
from typing import TYPE_CHECKING

from engine.enums.process_type import ProcessType
from engine.process.door.execution_request import ExecutionRequest

SNAPSHOT_FILE = "tests/snapshots/engine_contract.json"
VERSION_FILE = "src/engine/version/version.py"
CONTRACT_SCRIPT = "scripts/engine_contract.py"
CONTRACT_FILES = (SNAPSHOT_FILE, VERSION_FILE)
VERSION_LINE = re.compile(r"ENGINE_VERSION = \((\d+), (\d+), (\d+)\)")
SCRIPT_LIMIT_SECONDS = 120
GIT_LIMIT_SECONDS = 60

if TYPE_CHECKING:
    from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class ContractClashes:
    """Settles a clash of the engine's pinned contract and its version, which every change of the engine rewrites: the
    higher version stands and the snapshot is written again by the contract script on the merged tree, so such a clash
    is never sent back to the worker. A clash on any other file is left as it is."""

    def __init__(self, git: "WorktreeGit") -> None:
        self.git = git

    def settled(self, folder: str, base_branch: str, conflicts: Sequence[str]) -> tuple[str, ...]:
        if not any(path in CONTRACT_FILES for path in conflicts):
            return tuple(conflicts)
        self.keep_higher_version(folder, base_branch)
        self.git.checked(folder, GIT_LIMIT_SECONDS, "restore", f"--source={base_branch}", "--staged", "--worktree", "--", SNAPSHOT_FILE)
        self.git.executor.execute(ExecutionRequest(["python3", CONTRACT_SCRIPT], Path(folder), ProcessType.QUICK, SCRIPT_LIMIT_SECONDS))
        self.git.checked(folder, GIT_LIMIT_SECONDS, "add", "--", SNAPSHOT_FILE, VERSION_FILE)
        return tuple(path for path in conflicts if path not in CONTRACT_FILES)

    def keep_higher_version(self, folder: str, base_branch: str) -> None:
        ours, theirs = self.version(self.git.file_text(folder, "HEAD", VERSION_FILE)), self.version(self.git.file_text(folder, base_branch, VERSION_FILE))
        Path(folder, VERSION_FILE).write_text(self.git.file_text(folder, "HEAD" if ours >= theirs else base_branch, VERSION_FILE))

    @staticmethod
    def version(text: str) -> tuple[int, ...]:
        found = VERSION_LINE.search(text)
        return tuple(int(number) for number in found.groups()) if found is not None else (0, 0, 0)
