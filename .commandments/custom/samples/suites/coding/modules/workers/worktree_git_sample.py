import subprocess
from pathlib import Path

from engine.enums.process_kind import ProcessKind
from engine.process.door.execution_request import ExecutionRequest

LIMIT_SECONDS = 60


class WorktreeGit:
    def tip(self, folder: str, branch: str) -> str:
        # @righteous architecture_workers_git_call_without_time_limit
        return subprocess.run(["git", "-C", folder, "rev-parse", branch], capture_output=True, text=True, timeout=LIMIT_SECONDS, check=False).stdout

    def status(self, folder: str) -> str:
        # @sin architecture_workers_git_call_without_time_limit
        return subprocess.run(["git", "-C", folder, "status"], capture_output=True, text=True, check=False).stdout

    def door_status(self, folder: str) -> str:
        # @sin architecture_workers_git_call_without_time_limit
        return self.executor.execute(ExecutionRequest(["git", "-C", folder, "status"], Path(folder), ProcessKind.QUICK, LIMIT_SECONDS)).stdout

    def door_tip(self, folder: str, branch: str) -> str:
        # @righteous architecture_workers_git_call_without_time_limit
        return self.executor.execute(ExecutionRequest(["git", "-C", folder, "rev-parse", branch], Path(folder), ProcessKind.READ, LIMIT_SECONDS)).stdout

    def rebase(self, folder: str, base_branch: str) -> None:
        # @righteous architecture_workers_merge_names_a_literal_branch
        self.git(folder, "rebase", base_branch)
        # @sin architecture_workers_merge_names_a_literal_branch
        self.git(folder, "rebase", "HEAD")
        # @sin architecture_workers_merge_names_a_literal_branch
        self.git(folder, "merge", "--no-ff", "main")
        # @righteous architecture_workers_merge_names_a_literal_branch
        self.git(folder, "rebase", "--abort")

    def queued_merge(self, worker_id: int) -> list[str]:
        # @righteous architecture_workers_merge_names_a_literal_branch
        return self.command(["worker", "merge", str(worker_id)])

    def command(self, arguments: list[str]) -> list[str]:
        return arguments

    def head(self, folder: str) -> str:
        # @righteous architecture_workers_checkout_head_read
        return self.git(folder, "symbolic-ref", "--short", "HEAD")

    def branch(self, folder: str) -> str:
        # @sin architecture_workers_checkout_head_read
        return self.git(folder, "rev-parse", "--abbrev-ref", "HEAD")

    def moved(self, folder: str, branch: str) -> str:
        # @sin architecture_workers_checkout_head_read
        return self.git(folder, "checkout", branch)

    def git(self, folder: str, *arguments: str) -> str:
        return subprocess.run(["git", "-C", folder, *arguments], capture_output=True, text=True, timeout=LIMIT_SECONDS, check=False).stdout
