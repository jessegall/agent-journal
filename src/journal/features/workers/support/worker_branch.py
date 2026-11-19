import re
import shutil
import subprocess
from pathlib import Path

from journal.config import Config
from journal.events.worker_merging import WorkerMerging
from journal.features.workers.support.carry_branch import CarryBranch
from journal.features.workers.support.merge_clash import MergeClash
from journal.features.workers.support.worker_repository import PROJECT_FOLDER, WorkerRepository
from journal.models.worker import Worker
from journal.support.listener_queue import ListenerQueue
from journal.support.inner_repositories import InnerRepositories
from journal.support.rejection import Rejection
from journal.support.worktree_refs import TIPS_REF
from journal.support.worktree import Worktree
from journal.repositories.environments import Environments
from journal.repositories.setting_rows import SettingRows
from journal.sync.team_account import TeamAccount
from journal.features.workers.workers_options import WorkersOptions

GIT_TIMEOUT_SECONDS = 30
CHECKOUT_TIMEOUT_SECONDS = 600

BUILD_SECONDS = 600

# what a worker does when its branch clashes with the branch its work merges into
AUTOSTASH = "autostash"
REBASE_STEPS = "fix only the files that clash, keeping both sides' changes and removing every conflict marker; never run git, since the journal adds them and goes on with the rebase when you clock out"
CONFLICT_MARKER = re.compile(r"^(<{7}|>{7}) ", re.MULTILINE)
REBUILD_SUBJECT = "Build the built files again on the project's branch"
# a brief that names the branch its work is on, in its repositories sentence ("Repositories: platform, on feature/payroll-v2")
# or after "base:" / "base branch:", gives each inner repository holding that branch a checkout of it, which the worker's branch
# is cut from and its commits are merged into; a branch a brief only tells about ("merged on release/0.5") is none
BRIEF_BRANCH = re.compile(r"(?:\brepositories:[^.\n]*?\bon|\bbase(?:\s+branch)?:)\s+`?((?:feature|fix|hotfix|bugfix|release|stage|chore)/[\w.\-/]*[\w-])`?", re.IGNORECASE)
BASES = "bases"
CLASHES_BEFORE_GIVING_UP = 5


class WorkerBranch:
    """A worker's worktree and the branch it commits on: what it left there when it ended, and its commits taken into the branch the project is on, or while carry merges are on into that branch's carry ref, which on a shared journal is the branch of the worker's environment's own worktree, never the main checkout's. A project that holds repositories of its own inside it, ignored by its own, gives the worker a worktree of each one recorded on its row, inside its worktree and on the worker's branch; its commits are taken in from every repository or from none. A rebase that clashes only in folders the settings name as built from the sources takes the project's side of them and builds them again. Untracked files are those the branch adds that lie untracked in the checkout, which git refuses to overwrite, never a clash a rebase could mend; the worktree is moved up to the branch its work merges into, in each repository, by the same rebase a merge makes: after a merge its own commits are in the branch already and drop out, before a job it carries them over what others merged meanwhile; the uncommitted edits the rebase's autostash set aside are put back over it with conflicts, and once the markers are gone they are plain uncommitted edits again and the autostash is dropped; git drops from its list a worktree whose folder is missing, so while a launch's worktree under .claude/worktrees is briefly away nothing is pruned and a worker's clean-up never loses it; the checkout's skills its worktree lacks, the untracked and ignored ones a launch's worktree links, are linked into it and kept out of git; the summary says what a worker that ended without clocking out left: commits waiting on its branch unchecked, never taken in by its end."""

    def __init__(self, config: Config, deferred: ListenerQueue, account: TeamAccount, environments: Environments, settings: SettingRows, carry: CarryBranch) -> None:
        self.config, self.deferred, self.account, self.environments, self.settings, self.carry = config, deferred, account, environments, settings, carry
        self.removed_root = config.home / "removed-worktrees"
        # (checkout, branch) pairs found to hold no such branch, so a brief naming one is not fetched for again and again
        self.missing_bases: set[tuple[Path, str]] = set()

    def name(self, worker: Worker) -> str:
        return f"worker/{worker.id}-{worker.name}".replace(" ", "-")

    def folder(self, worker: Worker) -> Path:
        return self.config.home / "worktrees" / f"{worker.id}-{worker.name}".replace(" ", "-")

    def place(self, worker: Worker) -> Path:
        return self.folder(worker) if worker.worktree else self.checkout(worker)

    def skills_linked(self, worker: Worker) -> None:
        folder, tree = self.folder(worker), Worktree(self.checkout(worker), self.folder(worker).name)
        missing = [path for path in tree.skills() if not (folder / path).is_symlink() and not (folder / path).exists()]
        if missing:
            tree.excluded(missing)
        for path in missing:
            tree.linked(folder / path, tree.root / path)

    def checkout(self, worker: Worker) -> Path:
        environment = self.environments.find(worker.environment_id)
        tree = Worktree(self.config.root, environment.name)
        if environment.branch == tree.branch and not tree.path.is_dir():
            raise Rejection(f"the worktree of {environment.name} is gone, so workers cannot start: launch {environment.name} again")
        if not self.account.is_joined():
            return self.config.root
        return tree.path if tree.path.is_dir() else self.config.root

    def git(self, *argv: str, cwd: Path | None = None) -> subprocess.CompletedProcess:
        return subprocess.run(["git", *argv], cwd=cwd or self.config.root, capture_output=True, text=True, timeout=GIT_TIMEOUT_SECONDS)

    def checkout_git(self, *argv: str, cwd: Path) -> subprocess.CompletedProcess:
        return subprocess.run(["git", *argv], cwd=cwd, capture_output=True, text=True, timeout=CHECKOUT_TIMEOUT_SECONDS)

    def inner_folders(self) -> tuple[str, ...]:
        return InnerRepositories(self.config.root).names()

    def inner_checkout(self, worker: Worker, name: str) -> Path:
        """The checkout of the inner repository name that the worker's branch is cut from and merged into: the project's own, or a checkout of another branch the journal keeps under its home (bases/<name>/<branch>). A worker whose branch is there already keeps the base it was cut from, whatever its brief says now: a brief is replaced by every later instruction ("The journal restarted while you were at work"), and on 19 Nov such a worker was rebased onto main. A worker not started yet takes the branch its brief names, when this repository holds it and the project's checkout is not on it, made once from the local branch or from origin's; a branch git has out elsewhere already is used where it is."""
        checkout = self.config.root / name
        own = f"refs/heads/{self.name(worker)}"
        if self.git("rev-parse", "--verify", "-q", own, cwd=checkout).returncode == 0:
            bases = self.config.home / BASES / name
            held = sorted(path for path in bases.iterdir() if (path / ".git").exists()) if bases.is_dir() else []
            tips = (own, *self.worktree_tips(self.folder(worker) / name))
            return next((base for base in held if any(self.is_cut_from(tip, base, checkout) for tip in tips)), checkout)
        for branch in dict.fromkeys(BRIEF_BRANCH.findall(worker.brief or "")):
            base = self.base_checkout(checkout, name, branch)
            if base is not None:
                return base
        return checkout

    def worktree_tips(self, worktree: Path) -> tuple[str, ...]:
        """What the worker's worktree holds, which the worker may have moved off the journal's branch: on 19 Nov workers cut
        their own branches from feature/payroll-framework-v2 there, and every clock-out rebased them onto main, replaying all
        of v2 one clash at a time. A rebase stopped halfway holds the tip it started from."""
        if not (worktree / ".git").exists():
            return ()
        started = worktree / self.git("rev-parse", "--git-path", "rebase-merge/orig-head", cwd=worktree).stdout.strip()
        if started.is_file():
            return (started.read_text().strip(),)
        head = self.git("rev-parse", "-q", "--verify", "HEAD", cwd=worktree).stdout.strip()
        return (head,) if head else ()

    def is_cut_from(self, own: str, base: Path, checkout: Path) -> bool:
        """Whether the worker's branch was cut from the base checkout's branch: where the two meet lies beyond the project's checkout. A worker cut from the project's checkout before its brief named a branch meets the base inside it, so it keeps merging there and never pours the project's branch into the base."""
        fork = self.git("merge-base", own, "HEAD", cwd=base).stdout.strip()
        return bool(fork) and self.git("merge-base", "--is-ancestor", fork, "HEAD", cwd=checkout).returncode != 0

    def base_checkout(self, checkout: Path, name: str, branch: str) -> Path | None:
        path = self.config.home / BASES / name / branch.replace("/", "--")
        if (path / ".git").exists():
            return path
        if (checkout, branch) in self.missing_bases or not (checkout / ".git").exists():
            return None
        held = self.git("worktree", "list", "--porcelain", cwd=checkout).stdout.split("\n\n")
        out = next((Path(entry.splitlines()[0].removeprefix("worktree ")) for entry in held if f"branch refs/heads/{branch}" in entry.splitlines()), None)
        if out is not None:
            return out
        if self.git("rev-parse", "--verify", "-q", f"refs/heads/{branch}", cwd=checkout).returncode == 0:
            argv: tuple[str, ...] = (str(path), branch)
        else:
            remote = f"refs/remotes/origin/{branch}"
            if self.git("rev-parse", "--verify", "-q", remote, cwd=checkout).returncode != 0:
                try:
                    self.checkout_git("fetch", "-q", "origin", f"+refs/heads/{branch}:{remote}", cwd=checkout)
                except subprocess.TimeoutExpired:
                    pass
            if self.git("rev-parse", "--verify", "-q", remote, cwd=checkout).returncode != 0:
                self.missing_bases.add((checkout, branch))
                return None
            # no --track: a checkout cloned with one branch fetches only it, and git sets no tracking on a ref it fetched by hand
            argv = ("--no-track", "-b", branch, str(path), remote)
        path.parent.mkdir(parents=True, exist_ok=True)
        added = self.checkout_git("worktree", "add", "-q", *argv, cwd=checkout)
        if added.returncode != 0:
            self.missing_bases.add((checkout, branch))
            return None
        return path

    def brief_folders(self, brief: str) -> tuple[str, ...]:
        return tuple(name for name in self.inner_folders() if re.search(rf"(?<![\w-]){re.escape(name)}(?![\w-])", brief, re.IGNORECASE))

    def repositories(self, worker: Worker) -> list[WorkerRepository]:
        folder = self.folder(worker)
        inner = [WorkerRepository(self.inner_checkout(worker, name), folder / name, Path(name)) for name in worker.repositories]
        return [WorkerRepository(self.checkout(worker), folder, PROJECT_FOLDER), *inner]

    def tip(self, repository: WorkerRepository, worker: Worker) -> str:
        head = self.git("rev-parse", "HEAD", cwd=repository.worktree) if repository.is_present else None
        return head.stdout.strip() if head is not None and head.returncode == 0 else self.name(worker)

    def is_commit(self, repository: WorkerRepository, tip: str) -> bool:
        return self.git("rev-parse", "--verify", "-q", f"{tip}^{{commit}}", cwd=repository.checkout).returncode == 0

    def touched(self, worker: Worker) -> tuple[str, ...] | None:
        if not worker.worktree:
            return None
        commit_repositories = [repository for repository in self.repositories(worker) if self.is_commit(repository, self.tip(repository, worker))]
        if not commit_repositories:
            return None
        return tuple(dict.fromkeys(path for repository in commit_repositories for path in self.repository_paths(repository, worker)))

    def repository_paths(self, repository: WorkerRepository, worker: Worker) -> list[str]:
        changed = self.git("diff", "--name-status", "-M", f"{self.into(repository)}...{self.tip(repository, worker)}", cwd=repository.checkout)
        return [repository.path(path) for line in changed.stdout.splitlines() for path in line.split("\t")[1:]] if changed.returncode == 0 else []

    def commits(self, repository: WorkerRepository, worker: Worker) -> list[str]:
        tip = self.tip(repository, worker)
        if not self.is_commit(repository, tip):
            return []
        finished = self.git("log", "--reverse", "--format=%h %s", f"{self.into(repository)}..{tip}", cwd=repository.checkout)
        if finished.returncode != 0:
            raise Rejection(f"git could not list worker {worker.id}'s commits in {repository.label()}: {(finished.stderr.strip().splitlines() or ['no reason'])[-1]}")
        return [line for line in finished.stdout.splitlines() if line.strip()]

    def unmerged_count(self, worker: Worker) -> int:
        return sum(len(self.commits(repository, worker)) for repository in self.repositories(worker))

    def pending(self, worker: Worker) -> list[WorkerRepository]:
        return [repository for repository in self.repositories(worker) if self.commits(repository, worker)]

    def remaining(self, worker: Worker) -> list[str]:
        return self.uncommitted_files(worker) + self.other_repository_folders(worker)

    def uncommitted_files(self, worker: Worker) -> list[str]:
        if not self.folder(worker).is_dir():
            return []
        return [repository.path(file) for repository in self.repositories(worker) if repository.is_present for file in self.status_files(repository.worktree)]

    def other_repository_folders(self, worker: Worker) -> list[str]:
        folder = self.folder(worker)
        if not folder.is_dir():
            return []
        return [f"{name}/" for name in self.inner_folders() if name not in worker.repositories and (folder / name).exists()]

    def status_files(self, folder: Path) -> list[str]:
        entries = iter(self.git("status", "--porcelain=v1", "-z", cwd=folder).stdout.split("\0"))
        files = []
        for entry in filter(None, entries):
            files.append(entry[3:])
            if entry[0] in "RC":
                next(entries, "")
        return files

    def merge(self, worker: Worker) -> str:
        stopped = self.stopped_rebase(worker)
        if stopped:
            return f"its commits were not taken in, since its worktree is in a rebase stopped on conflicts in {stopped}; the worker fixes them and the journal goes on with the rebase at its clock-out"
        pending = self.pending(worker)
        if not pending:
            return ""
        listings = [(self.heading(repository, worker), self.listing(repository, worker)) for repository in pending]
        refusal = self.refusal(pending, worker)
        if refusal:
            listed = "; ".join(f"{heading}: {listing}" for heading, listing in listings)
            return f"its commits were not taken in, since {refusal}: {listed}; take them in with git merge {self.name(worker)} in each repository"
        return "; ".join(f"{heading} were taken into this branch: {listing}" for heading, listing in listings)

    def heading(self, repository: WorkerRepository, worker: Worker) -> str:
        return f"its {len(self.commits(repository, worker))} commits" + (f" in {repository.folder}" if repository.is_inner else "")

    def listing(self, repository: WorkerRepository, worker: Worker) -> str:
        changed = self.git("diff", "--name-only", f"{self.into(repository)}...{self.tip(repository, worker)}", cwd=repository.checkout).stdout.split()
        return "; ".join(self.commits(repository, worker)) + f" (files: {', '.join(changed[:20])}{', and more' if len(changed) > 20 else ''})"

    def merged_lines(self, worker: Worker) -> int:
        total = 0
        for repository in self.repositories(worker):
            tip = self.tip(repository, worker)
            if not self.is_commit(repository, tip):
                continue
            counted = self.git("diff", "--numstat", f"{self.into(repository)}...{tip}", cwd=repository.checkout).stdout.splitlines()
            total += sum(int(line.split("\t")[0]) for line in counted if line.split("\t")[0].isdigit())
        return total

    def merged_shas(self, worker: Worker) -> tuple[str, ...]:
        shas: list[str] = []
        for repository in self.repositories(worker):
            tip = self.tip(repository, worker)
            if self.is_commit(repository, tip):
                shas.extend(self.git("rev-list", f"{self.into(repository)}..{tip}", cwd=repository.checkout).stdout.split())
        return tuple(shas)

    def merge_commit(self, worker: Worker) -> str:
        pending = self.pending(worker)
        blocked = self.blocking(pending, worker)
        if blocked:
            raise Rejection(f"worker {worker.id}'s work was not merged: something in the project is in the way\n{blocked}")
        clashing = self.clash(pending, worker)
        if clashing:
            raise MergeClash(worker.id, clashing)
        return ", ".join(self.head(repository) for repository in pending)

    def merging_event(self, type_name: type[WorkerMerging], worker: Worker, task_id: int, window_ms: int) -> WorkerMerging:
        return type_name(environment_id=worker.environment_id, worker=worker.id, name=worker.name, task=task_id, branch=self.name(worker), worktree=str(self.folder(worker)), repositories=worker.repositories, files=self.touched(worker) or (), base=self.base(worker), window_ms=window_ms)

    def base(self, worker: Worker) -> str:
        return self.git("rev-parse", "--abbrev-ref", "HEAD", cwd=self.checkout(worker)).stdout.strip()

    def into(self, repository: WorkerRepository) -> str:
        return self.carry.target(repository.checkout)

    def head(self, repository: WorkerRepository) -> str:
        head = self.git("rev-parse", self.into(repository), cwd=repository.checkout).stdout.strip()[:9]
        return f"{repository.folder} {head}" if repository.is_inner else head

    def refusal(self, pending: list[WorkerRepository], worker: Worker) -> str:
        return self.blocking(pending, worker) or self.clash(pending, worker)

    def blocking(self, pending: list[WorkerRepository], worker: Worker) -> str:
        return next((reason for repository in pending if (reason := self.blocked(repository, worker))), "")

    def clash(self, pending: list[WorkerRepository], worker: Worker) -> str:
        for repository in pending:
            clashing = self.rebased(repository, worker)
            if clashing:
                return f"rebased onto the branch of {repository.label()} there is a conflict in {clashing}"
        merges = []
        for repository in pending:
            clashing = self.merged(repository, worker)
            if clashing:
                note = f"; {', '.join(merge.label() for merge in merges)} took its commits in already" if merges else ""
                return f"there is a conflict in {clashing}{note}"
            merges.append(repository)
        return ""

    def blocked(self, repository: WorkerRepository, worker: Worker) -> str:
        checkout = repository.checkout
        if self.git("symbolic-ref", "-q", "HEAD", cwd=checkout).returncode != 0:
            return f"{repository.label()} is on no branch, a detached head"
        if not self.git("config", "user.name", cwd=checkout).stdout.strip() or not self.git("config", "user.email", cwd=checkout).stdout.strip():
            return f"git has no user.name and user.email in {repository.label()}, which a merge needs"
        return "" if self.carry.is_on() else self.checkout_blocked(repository, worker)

    def checkout_blocked(self, repository: WorkerRepository, worker: Worker) -> str:
        checkout = repository.checkout
        touched = set(self.git("diff", "--name-only", f"HEAD...{self.tip(repository, worker)}", cwd=checkout).stdout.split())
        overlap = sorted(repository.path(path) for path in touched & set(self.status_files(checkout)))
        if overlap:
            return f"you have uncommitted changes to files they change: {', '.join(overlap)}"
        lying = self.untracked_files(repository, worker)
        return f"its branch adds {', '.join(lying)}, which lie untracked in {repository.label()}: take them out of its branch (git rm --cached in its worktree, then commit) or move the checkout's copies aside, and merge again" if lying else ""

    def untracked_files(self, repository: WorkerRepository, worker: Worker) -> list[str]:
        added = self.git("diff", "--name-only", "--diff-filter=A", f"HEAD...{self.tip(repository, worker)}", cwd=repository.checkout).stdout.split()
        return sorted(repository.path(path) for path in self.git("ls-files", "--others", "--exclude-standard", "--", *added, cwd=repository.checkout).stdout.split()) if added else []

    def branch_untracked_files(self, worker: Worker) -> list[str]:
        return [path for repository in self.repositories(worker) for path in self.untracked_files(repository, worker)]

    def rebased_onto_branch(self, worker: Worker) -> str:
        if not worker.worktree or not self.folder(worker).is_dir():
            return ""
        for repository in self.repositories(worker):
            clashing = self.rebased(repository, worker)
            if clashing:
                return f"rebased onto the branch of {repository.label()} there is a conflict in {clashing}"
        return ""

    def rebased(self, repository: WorkerRepository, worker: Worker) -> str:
        if self.has_stopped_rebase(repository) and not self.is_rebasing_onto(repository):
            self.git("rebase", "--abort", cwd=repository.worktree)
        if self.has_stopped_rebase(repository) and worker.clashes >= CLASHES_BEFORE_GIVING_UP:
            self.git("rebase", "--abort", cwd=repository.worktree)
            return f"{repository.label()}, whose rebase clashed {worker.clashes} times in a row and was given up; the commits of the project's branch that are not the worker's own are never replayed, so ask for the worker's own commits to be cherry-picked onto the project's branch"
        unresolved = self.continue_rebase(repository) if self.has_stopped_rebase(repository) else ""
        if unresolved:
            return unresolved
        autostash_clash = self.autostash_conflicts(repository) if repository.is_present and self.conflicts(repository.worktree) else ""
        if autostash_clash:
            return autostash_clash
        self.carry.refreshed(repository.checkout)
        head = self.git("rev-parse", self.into(repository), cwd=repository.checkout).stdout.strip()
        if self.git("merge-base", "--is-ancestor", head, self.tip(repository, worker), cwd=repository.checkout).returncode == 0:
            return ""
        if not repository.is_present:
            return f"{repository.label()}, whose worktree is gone, so its commits cannot be rebased"
        return self.rebase_conflicts(repository, self.git("rebase", "--autostash", *self.own_commits_onto(repository, head), cwd=repository.worktree))

    def own_commits_onto(self, repository: WorkerRepository, head: str) -> tuple[str, ...]:
        """The rebase arguments that replay only the worker's own commits onto head: those on no other branch, so commits other tasks landed that the worker's branch holds under other hashes are not replayed."""
        branch = self.git("rev-parse", "--abbrev-ref", "HEAD", cwd=repository.worktree).stdout.strip()
        own = self.git("rev-list", "HEAD", "--not", head, f"--exclude={branch}", "--branches", "--remotes", cwd=repository.worktree).stdout.split()
        return ("--onto", head, f"{own[-1]}^") if own else (head,)

    def unresolved_conflicts(self, repository: WorkerRepository) -> str:
        return ", ".join(repository.path(path) for path in self.conflicts(repository.worktree).split(", ") if path and self.has_conflict_markers(repository.worktree / path))

    def continue_rebase(self, repository: WorkerRepository) -> str:
        unresolved = self.unresolved_conflicts(repository)
        if unresolved:
            return unresolved
        self.git("add", "-A", cwd=repository.worktree)
        return self.rebase_conflicts(repository, self.git("-c", "core.editor=true", "rebase", "--continue", cwd=repository.worktree))

    def autostash_conflicts(self, repository: WorkerRepository) -> str:
        unresolved = self.unresolved_conflicts(repository)
        if unresolved:
            return unresolved
        self.git("reset", "-q", cwd=repository.worktree)
        if AUTOSTASH in self.git("stash", "list", "-n", "1", cwd=repository.worktree).stdout:
            self.git("stash", "drop", "-q", cwd=repository.worktree)
        return ""

    def rebase_conflicts(self, repository: WorkerRepository, outcome: subprocess.CompletedProcess) -> str:
        folder, rebuilt = repository.worktree, False
        while self.is_automatic_step(folder, outcome):
            rebuilt = rebuilt or bool(self.conflicts(folder))
            outcome = self.project_side(folder) if self.conflicts(folder) else self.git("rebase", "--skip", cwd=folder)
        clashing = self.conflicts(folder)
        if outcome.returncode == 0 and not clashing:
            return self.rebuild(folder) if rebuilt else ""
        return ", ".join(repository.path(path) for path in clashing.split(", ")) if clashing else f"the files of {repository.label()}"

    def is_automatic_step(self, folder: Path, outcome: subprocess.CompletedProcess) -> bool:
        return outcome.returncode != 0 and self.is_rebasing(folder) and (self.is_built_clash(folder) or self.is_empty_step(folder))

    def stopped_rebase(self, worker: Worker) -> str:
        stopped = [repository for repository in self.repositories(worker) if self.has_stopped_rebase(repository)]
        return ", ".join(repository.path(path) for repository in stopped for path in self.conflicts(repository.worktree).split(", ") if path) or ", ".join(repository.label() for repository in stopped)

    def is_rebasing_onto(self, repository: WorkerRepository) -> bool:
        """Whether the stopped rebase goes onto the branch the worker merges into: one stopped onto main while the worker was cut
        from another base is given up, not carried on."""
        onto = repository.worktree / self.git("rev-parse", "--git-path", "rebase-merge/onto", cwd=repository.worktree).stdout.strip()
        if not onto.is_file():
            return True
        head = self.git("rev-parse", self.into(repository), cwd=repository.checkout).stdout.strip()
        return self.git("merge-base", "--is-ancestor", onto.read_text().strip(), head, cwd=repository.checkout).returncode == 0

    def has_stopped_rebase(self, repository: WorkerRepository) -> bool:
        return repository.is_present and self.is_rebasing(repository.worktree)

    def is_rebasing(self, folder: Path) -> bool:
        return any((folder / self.git("rev-parse", "--git-path", name, cwd=folder).stdout.strip()).exists() for name in ("rebase-merge", "rebase-apply"))

    def is_empty_step(self, folder: Path) -> bool:
        return not self.conflicts(folder) and self.git("diff", "--cached", "--quiet", cwd=folder).returncode == 0

    @staticmethod
    def has_conflict_markers(path: Path) -> bool:
        return path.is_file() and bool(CONFLICT_MARKER.search(path.read_text(errors="replace")))

    def commit_changes(self, worker: Worker, message: str) -> None:
        for repository in self.changed_repositories(worker):
            self.git("add", "-A", cwd=repository.worktree)
            self.git("commit", "-qm", message, cwd=repository.worktree)

    def changed_repositories(self, worker: Worker) -> list[WorkerRepository]:
        return [repository for repository in self.repositories(worker) if repository.is_present and not self.is_rebasing(repository.worktree) and self.status_files(repository.worktree)]

    def worktree_heads(self, worker: Worker) -> tuple[str, ...]:
        if not worker.worktree or not self.folder(worker).is_dir():
            return ()
        return tuple(self.git("rev-parse", "HEAD", cwd=repository.worktree).stdout.strip() for repository in self.repositories(worker) if repository.is_present)

    def project_heads(self, worker: Worker) -> str:
        return ", ".join(self.head(repository) for repository in self.repositories(worker))

    def built_paths(self) -> tuple[str, ...]:
        lines = self.settings.texts(WorkersOptions.BUILT_PATHS)
        return tuple(path.strip().rstrip("/") + "/" for path in lines if path.strip())

    def is_built_clash(self, folder: Path) -> bool:
        clashing = self.conflicts(folder)
        return bool(clashing) and all(self.is_built(path) for path in clashing.split(", "))

    def is_built(self, path: str) -> bool:
        return bool(self.built_paths()) and path.startswith(self.built_paths())

    def project_side(self, folder: Path) -> subprocess.CompletedProcess:
        for path in self.conflicts(folder).split(", "):
            if self.git("checkout", "--ours", "--", path, cwd=folder).returncode != 0:
                self.git("rm", "-q", "--", path, cwd=folder)
        self.git("add", "-A", "--", *self.built_paths(), cwd=folder)
        return self.git("-c", "core.editor=true", "rebase", "--continue", cwd=folder)

    def rebuild(self, folder: Path) -> str:
        command = str(self.settings.option(WorkersOptions.BUILD_COMMAND)).strip()
        if command and subprocess.run(command, shell=True, cwd=folder, capture_output=True, text=True, timeout=BUILD_SECONDS).returncode != 0:
            return f"the build that makes {', '.join(self.built_paths())} again failed after the merge took the project's side of them"
        self.git("add", "-A", "--", *self.built_paths(), cwd=folder)
        if self.git("diff", "--cached", "--quiet", cwd=folder).returncode != 0:
            self.git("commit", "-qm", REBUILD_SUBJECT, cwd=folder)
        return ""

    def clash_preview(self, worker: Worker) -> str:
        clashing = []
        for repository in self.pending(worker):
            tip = self.tip(repository, worker)
            if not self.is_commit(repository, tip):
                continue
            tree = self.git("merge-tree", "--write-tree", "--name-only", "--no-messages", self.into(repository), tip, cwd=repository.checkout)
            if tree.returncode == 1:
                clashing += [str(repository.path(path)) for path in tree.stdout.split()[1:] if not self.is_built(path)]
        return ", ".join(clashing)

    def merged(self, repository: WorkerRepository, worker: Worker) -> str:
        return self.carry.taken_in(repository.checkout, self.tip(repository, worker)) if self.carry.is_on() else self.checkout_merged(repository, worker)

    def checkout_merged(self, repository: WorkerRepository, worker: Worker) -> str:
        merged = self.git("merge", "--no-edit", self.tip(repository, worker), cwd=repository.checkout)
        if merged.returncode == 0:
            return ""
        clashing = self.conflicts(repository.checkout) or (merged.stderr.strip().splitlines() or ["git refused"])[-1]
        self.git("merge", "--abort", cwd=repository.checkout)
        return clashing

    def conflicts(self, folder: Path) -> str:
        return ", ".join(self.git("diff", "--name-only", "--diff-filter=U", cwd=folder).stdout.split())

    def dropped(self, worker: Worker) -> str:
        folder = self.folder(worker)
        if not worker.worktree or not folder.is_dir():
            return ""
        if worker.is_running():
            return f"its worktree {folder} stays while it works"
        leftover = self.remaining(worker)
        if leftover:
            return f"its worktree {folder} stays, since {len(leftover)} files in it are not committed: {', '.join(leftover[:10])}"
        repositories = self.repositories(worker)
        for repository in repositories:
            tip = self.tip(repository, worker)
            if self.is_commit(repository, tip):
                self.git("update-ref", f"{TIPS_REF}/{folder.name}", tip, cwd=repository.checkout)
        self.removed(folder, self.name(worker), [repository.checkout for repository in repositories])
        return f"its worktree and branch are removed; its last commit is kept as {TIPS_REF}/{folder.name}"

    def removed(self, folder: Path, branch: str, checkouts: list[Path]) -> None:
        self.removed_root.mkdir(parents=True, exist_ok=True)
        folder.rename(self.removed_root / folder.name)
        self.deferred.add(lambda: self.cleared(branch, checkouts))

    def cleared(self, branch: str, checkouts: list[Path]) -> None:
        self.pruned(branch, checkouts)
        for folder in self.removed_root.iterdir():
            shutil.rmtree(folder)

    def pruned(self, branch: str, checkouts: list[Path]) -> None:
        for checkout in checkouts:
            self.worktree_list_pruned(checkout)
            self.git("branch", "-D", branch, cwd=checkout)

    def worktree_list_pruned(self, checkout: Path) -> None:
        listed = [Path(line.removeprefix("worktree ")) for line in self.git("worktree", "list", "--porcelain", cwd=checkout).stdout.splitlines() if line.startswith("worktree ")]
        if any(path.parent.name == "worktrees" and path.parent.parent.name == ".claude" and not path.exists() for path in listed):
            return
        self.git("worktree", "prune", cwd=checkout)

    def discarded(self, worker: Worker, names: tuple[str, ...]) -> None:
        folder = self.folder(worker)
        if folder.is_dir():
            shutil.rmtree(folder)
        self.pruned(self.name(worker), [self.inner_checkout(worker, name) for name in names] + [self.checkout(worker)])

    def summary(self, worker: Worker) -> str:
        if not worker.worktree:
            return ""
        waiting = "; ".join(f"{self.heading(repository, worker)} wait on its branch, unchecked: {self.listing(repository, worker)}" for repository in self.pending(worker))
        return ". ".join(part for part in (waiting, self.leftover(worker)) if part)

    def leftover(self, worker: Worker) -> str:
        files = self.remaining(worker)
        return f"it left {len(files)} files uncommitted in its worktree {self.folder(worker)}: {', '.join(files[:10])}" if files else ""
