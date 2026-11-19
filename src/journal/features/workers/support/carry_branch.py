import subprocess
from pathlib import Path

from journal.features.workers.workers_options import WorkersOptions
from journal.repositories.setting_rows import SettingRows

CARRY_REF = "refs/journal/carry"
REMOTE = "origin"
GIT_TIMEOUT_SECONDS = 30
FETCH_TIMEOUT_SECONDS = 120


class CarryBranch:
    """The ref a worker's merge moves forward instead of the checkout's branch while carry merges are on, for a plugin to deliver to origin: it takes in what origin's branch merged, and the checkout's branch only ever fast-forwards to origin's, so it is never ahead of it."""

    def __init__(self, settings: SettingRows) -> None:
        self.settings = settings

    def is_on(self) -> bool:
        return bool(self.settings.option(WorkersOptions.CARRY_MERGES))

    def target(self, checkout: Path) -> str:
        """The ref a worker's commits are compared with and merged into: the carry ref while carry merges are on, else the checkout's HEAD."""
        return self.ref(checkout) if self.is_on() else "HEAD"

    def ref(self, checkout: Path) -> str:
        return f"{CARRY_REF}/{self.git('rev-parse', '--abbrev-ref', 'HEAD', cwd=checkout).stdout.strip()}"

    def refreshed(self, checkout: Path) -> None:
        """Fast-forward the checkout's branch to origin's, and bring the carry ref up to what origin's branch merged."""
        if not self.is_on():
            return
        ref, remote = self.ref(checkout), self.remote(checkout)
        if not self.is_commit(checkout, ref):
            self.moved(checkout, ref, "HEAD", "start the carry branch at the checkout's branch")
        if not remote:
            return
        if self.is_ancestor(checkout, "HEAD", remote):
            self.git("merge", "--ff-only", "-q", remote, cwd=checkout)
        if self.is_ancestor(checkout, remote, ref):
            return
        if self.is_ancestor(checkout, ref, remote):
            self.moved(checkout, ref, remote, f"fast-forward to {remote}")
            return
        self.origin_merged(checkout, ref, remote)

    def remote(self, checkout: Path) -> str:
        """origin's copy of the checkout's branch, fetched now, or empty when the checkout has no origin or it lacks the branch."""
        branch = self.git("rev-parse", "--abbrev-ref", "HEAD", cwd=checkout).stdout.strip()
        if self.git("remote", "get-url", REMOTE, cwd=checkout).returncode != 0:
            return ""
        subprocess.run(["git", "fetch", "-q", REMOTE, branch], cwd=checkout, capture_output=True, text=True, timeout=FETCH_TIMEOUT_SECONDS)
        remote = f"refs/remotes/{REMOTE}/{branch}"
        return remote if self.is_commit(checkout, remote) else ""

    def origin_merged(self, checkout: Path, ref: str, remote: str) -> None:
        """Merge origin's branch into the carry ref without a worktree; a conflict leaves the carry ref where it was."""
        tree = self.git("merge-tree", "--write-tree", ref, remote, cwd=checkout)
        if tree.returncode != 0:
            return
        commit = self.git("commit-tree", tree.stdout.split()[0], "-p", ref, "-p", remote, "-m", f"Take in what {remote} merged", cwd=checkout)
        if commit.returncode == 0:
            self.moved(checkout, ref, commit.stdout.strip(), f"take in {remote}")

    def taken_in(self, checkout: Path, tip: str) -> str:
        """Move the carry ref forward to a worker's rebased tip, or say why it could not."""
        ref = self.ref(checkout)
        if not self.is_ancestor(checkout, ref, tip):
            return f"{ref}, which moved under its branch"
        moved = self.moved(checkout, ref, tip, f"worker merge {tip[:9]}")
        return "" if moved.returncode == 0 else (moved.stderr.strip().splitlines() or [f"git refused to move {ref}"])[-1]

    def moved(self, checkout: Path, ref: str, to: str, reason: str) -> subprocess.CompletedProcess:
        return self.git("update-ref", "--create-reflog", "-m", reason, ref, to, cwd=checkout)

    def is_ancestor(self, checkout: Path, ancestor: str, descendant: str) -> bool:
        return self.git("merge-base", "--is-ancestor", ancestor, descendant, cwd=checkout).returncode == 0

    def is_commit(self, checkout: Path, ref: str) -> bool:
        return self.git("rev-parse", "--verify", "-q", f"{ref}^{{commit}}", cwd=checkout).returncode == 0

    @staticmethod
    def git(*argv: str, cwd: Path) -> subprocess.CompletedProcess:
        return subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=GIT_TIMEOUT_SECONDS)
