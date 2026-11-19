import subprocess
from pathlib import Path

import pytest

from journal.features.workers.support.carry_branch import CarryBranch
from journal.repositories.setting_rows import SettingRows
from journal.support.actor import Actor
from journal.support.time_source import TimeSource

IDENTITY = ("-c", "user.name=Story", "-c", "user.email=story@example.com")


def git(folder: Path, *argv: str) -> str:
    return subprocess.run(["git", *IDENTITY, *argv], cwd=folder, capture_output=True, text=True, timeout=30, check=True).stdout.strip()


def is_ancestor(folder: Path, ancestor: str, descendant: str) -> bool:
    return subprocess.run(["git", "merge-base", "--is-ancestor", ancestor, descendant], cwd=folder, timeout=30).returncode == 0


class Workspace:
    """A bare origin, the project's checkout of it, and a host clone that merges the delivered pull requests as GitHub does, by merge commit."""

    def __init__(self, root: Path) -> None:
        self.origin, self.checkout, self.host = root / "origin.git", root / "checkout", root / "host"
        git(root, "init", "-q", "--bare", "-b", "main", str(self.origin))
        git(root, "clone", "-q", str(self.origin), str(self.checkout))
        git(self.checkout, "config", "user.name", "Story")
        git(self.checkout, "config", "user.email", "story@example.com")
        (self.checkout / "README.md").write_text("start\n")
        git(self.checkout, "add", "README.md")
        git(self.checkout, "commit", "-qm", "start")
        git(self.checkout, "push", "-q", "origin", "main")
        git(root, "clone", "-q", str(self.origin), str(self.host))
        self.waiting: list[tuple[str, str]] = []

    def worker_merged(self, carry: CarryBranch, name: str) -> None:
        """A worker's commit cut from the carry ref, rebased and taken in as the journal does, and its commits delivered as a pull request from origin's main."""
        carry.refreshed(self.checkout)
        ref = carry.ref(self.checkout)
        before = git(self.checkout, "rev-parse", ref)
        git(self.checkout, "branch", "-q", "-f", f"worker/{name}", before)
        git(self.checkout, "checkout", "-q", f"worker/{name}")
        (self.checkout / f"{name}.txt").write_text(f"{name}\n")
        git(self.checkout, "add", f"{name}.txt")
        git(self.checkout, "commit", "-qm", name)
        tip = git(self.checkout, "rev-parse", "HEAD")
        git(self.checkout, "checkout", "-q", "main")
        assert carry.taken_in(self.checkout, tip) == "", "the worker's rebased tip moves the carry ref forward"
        self.waiting.append((name, git(self.checkout, "diff", "--binary", before, tip) + "\n"))

    def pull_request_merged(self) -> None:
        """The oldest waiting pull request, its patch on a branch from origin's main, merged into main by merge commit."""
        name, patch = self.waiting.pop(0)
        git(self.host, "fetch", "-q", "origin")
        git(self.host, "checkout", "-q", "-B", f"feature/{name}", "origin/main")
        subprocess.run(["git", "apply", "--index"], cwd=self.host, input=patch, text=True, timeout=30, check=True)
        git(self.host, "commit", "-qm", f"Task: {name}")
        git(self.host, "checkout", "-q", "-B", "main", "origin/main")
        git(self.host, "merge", "-q", "--no-ff", "-m", f"Merge {name}", f"feature/{name}")
        git(self.host, "push", "-q", "origin", "main")

    def pull_is_a_fast_forward(self) -> bool:
        """What make env pull does to the checkout's main: fetch, then take origin's main in only by fast-forward."""
        git(self.checkout, "fetch", "-q", "origin")
        return subprocess.run(["git", "merge", "--ff-only", "-q", "origin/main"], cwd=self.checkout, capture_output=True, timeout=30).returncode == 0

    def main_is_level_or_behind(self) -> bool:
        git(self.checkout, "fetch", "-q", "origin")
        return is_ancestor(self.checkout, "main", "origin/main")


@pytest.fixture
def carry(connection, bus, scope) -> CarryBranch:
    settings = SettingRows(connection, bus, scope, TimeSource())
    with scope.environment(1):
        settings.set("workers.carry_merges", True, Actor.user(1))
    return CarryBranch(settings)


def test_three_worker_merges_leave_main_level_or_behind_origin_and_every_pull_a_fast_forward(tmp_path, carry):
    workspace = Workspace(tmp_path)
    start = git(workspace.checkout, "rev-parse", "main")

    workspace.worker_merged(carry, "first")
    assert git(workspace.checkout, "rev-parse", "main") == start, "a worker's merge leaves the checkout's main where it was"
    assert workspace.main_is_level_or_behind() and workspace.pull_is_a_fast_forward()
    workspace.worker_merged(carry, "second")
    assert workspace.main_is_level_or_behind() and workspace.pull_is_a_fast_forward(), "two merges waiting on their pull requests leave main level with origin"
    workspace.pull_request_merged()
    assert workspace.main_is_level_or_behind() and workspace.pull_is_a_fast_forward(), "a landed pull request is a fast-forward for main"
    workspace.worker_merged(carry, "third")
    assert workspace.main_is_level_or_behind() and workspace.pull_is_a_fast_forward()
    workspace.pull_request_merged()
    workspace.pull_request_merged()
    assert workspace.main_is_level_or_behind() and workspace.pull_is_a_fast_forward()
    assert git(workspace.checkout, "rev-parse", "main") == git(workspace.checkout, "rev-parse", "origin/main"), "once every pull request landed, main is level with origin"
    assert all((workspace.checkout / f"{name}.txt").is_file() for name in ("first", "second", "third")), "main holds every worker's work, taken in from origin"


def test_the_carry_ref_takes_in_what_origin_merged_and_main_fast_forwards_to_it(tmp_path, carry):
    workspace = Workspace(tmp_path)
    workspace.worker_merged(carry, "first")
    workspace.pull_request_merged()

    carry.refreshed(workspace.checkout)

    ref = carry.ref(workspace.checkout)
    assert is_ancestor(workspace.checkout, "origin/main", ref), "the carry ref holds origin's merge, so the next worker rebases onto it"
    assert git(workspace.checkout, "rev-parse", "main") == git(workspace.checkout, "rev-parse", "origin/main"), "the checkout's main was fast-forwarded to origin's"


def test_a_carry_ref_moved_under_the_workers_branch_is_a_clash(tmp_path, carry):
    workspace = Workspace(tmp_path)
    carry.refreshed(workspace.checkout)
    workspace.worker_merged(carry, "first")

    stale = git(workspace.checkout, "rev-parse", "main")

    assert "moved under its branch" in carry.taken_in(workspace.checkout, stale), "a tip that does not hold the carry ref is refused, never moved backwards"


def test_with_carry_merges_off_the_work_merges_into_the_checkouts_head(connection, bus, scope, tmp_path):
    carry = CarryBranch(SettingRows(connection, bus, scope, TimeSource()))

    assert carry.target(tmp_path) == "HEAD"
