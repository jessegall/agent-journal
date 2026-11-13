from types import SimpleNamespace

import pytest

from engine.enums.process_kind import ProcessKind
from engine.process.door.execution import Execution
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class RecordingExecutor:
    """Keeps the request of each run it is given."""

    def __init__(self) -> None:
        self.requests = []

    def execute(self, request):
        self.requests.append(request)
        return Execution(None, 0, "", "")


def run_git(*arguments: str) -> ProcessKind:
    git = WorktreeGit.__new__(WorktreeGit)
    git.executor = RecordingExecutor()
    git.git("/tmp/folder", 5, *arguments)
    return git.executor.requests[0].kind


@pytest.mark.parametrize("arguments", [("merge", "main"), ("-c", "user.name=x", "merge", "main"), ("-C", "/tmp/other", "rebase", "main"), ("--git-dir=/tmp/g", "commit", "-m", "x")],
                         ids=["plain", "config-option", "folder-option", "joined-option"])
def test_a_git_command_that_changes_a_branch_is_a_merge_run_whatever_options_come_before_it(arguments):
    assert run_git(*arguments) is ProcessKind.MERGE


@pytest.mark.parametrize("arguments", [tuple(["status"]), ("-c", "color.ui=never", "log", "-1"), ("rev-parse", "HEAD")], ids=["status", "config-option", "rev-parse"])
def test_a_git_command_that_only_reads_is_a_quick_run(arguments):
    assert run_git(*arguments) is ProcessKind.QUICK


def test_the_command_of_arguments_with_only_options_is_empty():
    assert WorktreeGit.subcommand(SimpleNamespace().__dict__.keys() or ["-c", "a=b"]) == ""
