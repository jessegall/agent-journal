import fcntl
import time
import os
import random
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path

from engine.package import ARCHIVE
from engine.paths import ENVIRONMENTS
from engine.proc import git_ran
from engine.runtime import DEFAULT_ENV
from resources.base import Refused, check_title

INCLUDED = ".worktreeinclude"
LINKED = ".worktreelinks"
BRANCHED = "worktree-"
KEPT = "refs/journal/worktrees"
GIT_WAIT = 60


@dataclass(frozen=True)
class WorkspaceFolders:
    homes: tuple[str, ...] = ()
    shared: tuple[str, ...] = ()
    shared_if_ignored: tuple[str, ...] = ()
    shared_in: tuple[str, ...] = ()
    worktrees: tuple[tuple[str, ...], ...] = ()

    @property
    def managed(self) -> tuple[str, ...]:
        return tuple(f"/{folder}/" for folder in self.shared_in)

    @property
    def worktree_home(self) -> tuple[str, ...]:
        return self.worktrees[0]


def checkout(start: Path, folders: WorkspaceFolders) -> Path | None:
    spanning = next((here for here in (start, *start.parents) if here.parent.parts[-2:] in folders.worktrees and not (here / ".git").exists()), None)
    if spanning:
        return spanning
    for here in (start, *start.parents):
        marker = here / ".git"
        if marker.is_dir():
            return None
        if marker.is_file():
            return here if "/worktrees/" in marker.read_text() else None
    return None


def environment(top: Path | None) -> str:
    try:
        name = check_title(top.name) if top else ""
    except Refused:
        return ""
    return "" if name == DEFAULT_ENV else name


NAME_WORDS = (("amber", "brisk", "calm", "deft", "eager", "fond", "gentle", "hardy", "keen", "lucid", "mellow", "nimble", "quiet", "rapid", "steady", "vivid"),
              ("otter", "heron", "maple", "cedar", "falcon", "harbor", "lantern", "meadow", "orchid", "pebble", "quartz", "river", "sparrow", "thistle", "willow", "zephyr"))


def unused_name(project: Path) -> str:
    taken = set(linked(project))
    names = [f"{first}-{second}" for first in NAME_WORDS[0] for second in NAME_WORDS[1]]
    random.shuffle(names)
    return next((name for name in names if name not in taken), f"worktree-{len(taken) + 1}")


def worktrees(project: Path) -> list[Path]:
    listed = git(project, "worktree", "list", "--porcelain")
    folders = [line.split(" ", 1)[1] for line in listed.stdout.splitlines() if line.startswith("worktree ")] if not listed.returncode else []
    return [Path(folder) for folder in folders[1:]]


def linked(project: Path) -> dict[str, Path]:
    return {folder.name: folder for folder in worktrees(project)}


def owns(project: Path, folder: Path) -> bool:
    """Whether a folder is a worktree of this repository: git lists it, whatever its folder and its admin folder are called, however far its checkout got."""
    return folder.resolve() in {path.resolve() for path in worktrees(project)}


def main_checkout(start: Path) -> Path:
    common = git(start, "rev-parse", "--path-format=absolute", "--git-common-dir")
    return Path(common.stdout.strip()).parent if not common.returncode and common.stdout.strip() else start


def opened(project: Path, folder: Path, branch: str, name: str = "") -> Path:
    name = name or folder.name
    kept = f"{KEPT}/{name}"
    git(project, "worktree", "prune")
    registered = owns(project, folder)
    if folder.is_dir() and not registered:
        raise SystemExit(f"journal: {folder} is a folder but not a worktree of this project; move it away and launch again")
    if not registered:
        known = present(project, f"refs/heads/{branch}")
        start = () if known or not present(project, kept) else (kept,)
        made = git(project, "worktree", "add", str(folder), *((branch,) if known else ("-b", branch, *start)))
        if made.returncode:
            raise SystemExit(f"journal: the worktree {folder.name} could not be made: {made.stderr.strip()}")
        included(project, folder)
        if not own_packages(project, name):
            packages_linked(project, folder)
    keep(project, name, branch)
    return folder


def repositories(folder: Path) -> list[Path]:
    inner = [child for child in sorted(folder.iterdir()) if child.is_dir() and not child.is_symlink() and not child.name.startswith(".") and (child / ".git").exists()]
    return ([folder] if (folder / ".git").exists() else []) + inner


def spread(project: Path) -> bool:
    return repositories(project) not in ([], [project])


def roots(project: Path) -> dict[str, Path]:
    return {str(repo.relative_to(project)): repo for repo in repositories(project)} if spread(project) else {".": project}


def changed(project: Path, branch: str, base: str) -> bool:
    ref = f"refs/heads/{branch}"
    return present(project, ref) and tip(project, ref) != base


def discarded(project: Path, folder: Path, branch: str, name: str) -> None:
    """Takes away what a start that never reached its agent left in one repository: its worktree, its branch and the ref that remembers it."""
    if owns(project, folder):
        git(project, "worktree", "remove", "--force", str(folder))
    git(project, "worktree", "prune")
    if branch and present(project, f"refs/heads/{branch}") and not checked_out(project, branch):
        git(project, "branch", "-D", branch)
        git(project, "update-ref", "-d", f"{KEPT}/{name}")


def freed(project: Path, folder: Path) -> bool:
    """Removes a worktree that holds nothing unsaved, keeping its branch; false when it is not one or holds changes."""
    if not owns(project, folder) or git(folder, "status", "--porcelain").stdout.strip():
        return False
    removed = git(project, "worktree", "remove", str(folder)).returncode == 0
    git(project, "worktree", "prune")
    return removed


def scratch_cleared(folder: Path) -> None:
    """Removes the temporary folders the agents of every provider kept for a working folder."""
    from providers import PROVIDERS
    for provider in PROVIDERS.values():
        scratch = provider().scratch_of(folder)
        if scratch is not None and scratch.is_dir():
            shutil.rmtree(scratch, ignore_errors=True)


def set_aside(project: Path, place: Path, folder: Path) -> Path | None:
    """Moves a folder that no worktree owns out of the way, into the worktree's own folder as .failed-<time>: only a start that failed partway leaves one, and nothing in it is deleted."""
    if not place.is_dir() or place.is_symlink() or owns(project, place):
        return None
    stamp = time.strftime("%Y%m%d-%H%M%S")
    away = next(folder / f".failed-{stamp}{suffix}" / place.relative_to(folder) for suffix in ("", *(f"-{n}" for n in range(2, 100))) if not (folder / f".failed-{stamp}{suffix}" / place.relative_to(folder)).exists())
    away.parent.mkdir(parents=True, exist_ok=True)
    place.rename(away)
    return away


def workspace(project: Path, folder: Path, folders: WorkspaceFolders) -> Path:
    name = folder.name
    found = repositories(project)
    existed, made = folder.exists(), []
    try:
        for repo in found:
            place, branch = folder / repo.relative_to(project), f"{BRANCHED}{name}"
            set_aside(repo, place, folder)
            had = owns(repo, place), present(repo, f"refs/heads/{branch}")
            opened(repo, place, branch, name)
            made.append((repo, place, branch, *had))
        return arranged(project, folder, folders, found)
    except BaseException:
        for repo, place, branch, had_tree, had_branch in reversed(made):
            if not had_tree:
                discarded(repo, place, branch if not had_branch else "", name)
        if not existed:
            shutil.rmtree(folder, ignore_errors=True)
        raise


def arranged(project: Path, folder: Path, folders: WorkspaceFolders, found: list[Path]) -> Path:
    if project in found:
        excluded(folder, [f"/{repo.name}/" for repo in found if repo != project], folders)
        return folder
    folder.mkdir(parents=True, exist_ok=True)
    nested = dict(folders.worktrees)
    for entry in project.iterdir():
        if entry not in found and entry.name != ".git" and entry.name not in nested:
            linked_to(folder / entry.name, entry.resolve())
    for home, kept_out in nested.items():
        for entry in (project / home).iterdir() if (project / home).is_dir() else ():
            if entry.name != kept_out:
                linked_to(folder / home / entry.name, entry.resolve())
    return folder


def keep(project: Path, name: str, branch: str) -> None:
    if present(project, f"refs/heads/{branch}"):
        git(project, "update-ref", f"{KEPT}/{name}", f"refs/heads/{branch}")


def authored(project: Path, branch: str) -> bool:
    """Whether a commit was made on the branch itself: its reflog holds a commit entry, which moving it onto the target's history never adds."""
    log = git(project, "reflog", "show", "--format=%gs", f"refs/heads/{branch}")
    return any(line.startswith("commit") for line in log.stdout.splitlines())


def merged(project: Path, branch: str, base: str, into: str = "HEAD") -> bool:
    ref = f"refs/heads/{branch}"
    if not base or not present(project, ref) or tip(project, ref) == base or not authored(project, branch):
        return False
    grew = git(project, "merge-base", "--is-ancestor", base, ref).returncode == 0
    return grew and git(project, "merge-base", "--is-ancestor", ref, into).returncode == 0


def current_branch(project: Path) -> str:
    return git(project, "symbolic-ref", "--short", "HEAD").stdout.strip()


def default_branch(project: Path) -> str:
    remote = git(project, "symbolic-ref", "--short", "refs/remotes/origin/HEAD").stdout.strip()
    return remote if remote and present(project, remote) else current_branch(project) or "HEAD"


def checked_out(project: Path, branch: str) -> Path | None:
    listed = git(project, "worktree", "list", "--porcelain").stdout.split("\n\n")
    held = [block.splitlines() for block in listed if f"branch refs/heads/{branch}" in block.splitlines()]
    return Path(held[0][0].split(" ", 1)[1]) if held else None


def merged_into(project: Path, branch: str, into: str) -> str:
    place = checked_out(project, into)
    if place:
        done = git(place, "merge", "--no-edit", branch)
        if done.returncode:
            git(place, "merge", "--abort")
            return (done.stderr or done.stdout).strip()
        return ""
    tree = git(project, "merge-tree", "--write-tree", into, branch)
    if tree.returncode:
        return f"it conflicts with {into}: {tree.stdout.strip().splitlines()[-1] if tree.stdout.strip() else tree.stderr.strip()}"
    made = git(project, "commit-tree", tree.stdout.split()[0], "-p", into, "-p", branch, "-m", f"Merge {branch} into {into}")
    return (made.stderr.strip() or "no merge commit") if made.returncode else git(project, "update-ref", f"refs/heads/{into}", made.stdout.strip()).stderr.strip()


def contains(project: Path, commit: str, branch: str) -> bool:
    return git(project, "merge-base", "--is-ancestor", commit, branch).returncode == 0


def branched(project: Path, branch: str, start: str, fresh: bool = False) -> str:
    ref = f"refs/heads/{branch}"
    if not present(project, ref):
        made = git(project, "branch", branch, start)
        return f"its branch {branch} could not be made from {start}: {made.stderr.strip()}" if made.returncode else ""
    if not fresh or tip(project, ref) == tip(project, start):
        return ""
    holder = checked_out(project, branch)
    if git(project, "merge-base", "--is-ancestor", ref, start).returncode == 0:
        if holder:
            git(holder, "merge", "--ff-only", "-q", start)
            return ""
        git(project, "branch", "-f", branch, start)
        return ""
    if holder:
        return f"its branch {branch} holds work from before and is checked out in {holder}; move that work away first"
    aside = f"{branch}-set-aside-{int(time.time())}"
    git(project, "branch", "-m", branch, aside)
    git(project, "branch", branch, start)
    return ""


def tip(project: Path, ref: str = "HEAD") -> str:
    branch = ref.removeprefix("refs/heads/")
    loose = project / ".git" / "refs" / "heads" / branch
    if ref != "HEAD" and loose.is_file():
        return loose.read_text().strip()
    found = git(project, "rev-parse", ref)
    return "" if found.returncode else found.stdout.strip()


def present(project: Path, ref: str) -> bool:
    return git(project, "rev-parse", "--verify", "--quiet", ref).returncode == 0


def matched(project: Path, pattern: str) -> list[Path]:
    try:
        found = list(project.glob(pattern.strip("/")))
    except (NotImplementedError, ValueError):
        return []
    return [file for path in found for file in ([path] if path.is_file() else (p for p in path.rglob("*") if p.is_file()))]


def included(project: Path, folder: Path) -> None:
    for found in (path for pattern in patterns_in(project, INCLUDED) for path in matched(project, pattern)):
        copy = folder / found.relative_to(project)
        if not copy.exists():
            copy.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(found, copy)


def patterns_in(project: Path, name: str) -> list[str]:
    found = project / name
    return [line.strip().strip("/") for line in found.read_text().splitlines() if line.strip() and not line.startswith("#")] if found.is_file() else []


def link_folders(project: Path, folder: Path) -> None:
    for pattern in patterns_in(project, LINKED):
        path = (project / pattern).resolve()
        if not path.is_relative_to(project.resolve()) or not path.exists():
            continue
        link = folder / path.relative_to(project.resolve())
        if not link.exists():
            link.parent.mkdir(parents=True, exist_ok=True)
            link.symlink_to(path)


PACKAGES = ("vendor", "node_modules")
OWN_PACKAGES = "journal.own-packages"


def own_packages(project: Path, name: str) -> bool:
    """Whether the job in a worktree changes the project's dependencies, and so installs its own instead of using the project's."""
    return git(project, "config", "--get", f"{OWN_PACKAGES}.{name}").stdout.strip() == "true"


def keep_own_packages(project: Path, name: str, on: bool) -> None:
    key = f"{OWN_PACKAGES}.{name}"
    if on:
        git(project, "config", key, "true")
    elif own_packages(project, name):
        git(project, "config", "--unset", key)


def packages_linked(repository: Path, folder: Path) -> list[Path]:
    """Links the installed packages of a repository (vendor and node_modules) into its worktree, so the worktree does not install them again."""
    made = []
    for name in PACKAGES:
        installed, link = repository / name, folder / name
        if installed.is_dir() and not installed.is_symlink() and not link.exists() and not link.is_symlink() and folder.is_dir():
            link.symlink_to(installed.resolve())
            made.append(link)
    if made:
        common = git(folder, "rev-parse", "--git-common-dir").stdout.strip()
        ignore((folder / common).resolve() / "info" / "exclude", [f"/{link.name}" for link in made])
    return made


def git(project: Path, *args: str, stdin: str | None = None) -> subprocess.CompletedProcess:
    failed = f"git {args[0]} did not finish within {GIT_WAIT} seconds or could not start"
    return git_ran(list(args), project, GIT_WAIT, stdin) or subprocess.CompletedProcess(["git", *args], 1, "", failed)


def lines(project: Path, *args: str) -> list[str]:
    return [line for line in git(project, *args).stdout.splitlines() if line.strip()]


def tracked_files(project: Path) -> list[str]:
    return [str((repo / name).relative_to(project)) for repo in repositories(project) for name in lines(repo, "ls-files")]


JOURNAL_FOLDER = ".journal"
JOURNAL_MARKS = (ENVIRONMENTS, ARCHIVE)


def share_journal(top: Path, root: Path, folders: WorkspaceFolders) -> None:
    project = root.resolve().parent
    if top.resolve() == project or not (top / ".git").is_file() or not belongs(top, project):
        return
    skills = [Path(folder) / entry.name for folder in folders.shared_in if (project / folder).is_dir() for entry in sorted((project / folder).iterdir())]
    hooks = [Path(path) for path in folders.shared_if_ignored if (project / path).exists()]
    linked_hooks = [path for path in hooks if is_linked(top / path, project / path)]
    linked_skills = [path for path in skills if is_linked(top / path, project / path)]
    pending_hooks = [path for path in hooks if path not in linked_hooks and ((top / path).is_symlink() or not (top / path).exists())]
    pending_skills = [path for path in skills if path not in linked_skills and ((top / path).is_symlink() or not (top / path).exists())]
    wanted = [Path(path) for path in (JOURNAL_FOLDER, *folders.shared)] + linked_hooks + ignored(project, pending_hooks, folders) + linked_skills + untracked(project, pending_skills)
    excluded(top, [f"/{path}" for path in wanted], folders)
    cleared(top, Path(JOURNAL_FOLDER))
    for path in wanted:
        linked_to(top / path, project / path)
    unshared(top, project, set(wanted), folders)


def cleared(top: Path, path: Path) -> None:
    place = top / path
    if place.is_symlink() or not place.is_dir() or any((place / mark).exists() for mark in JOURNAL_MARKS):
        return
    tracked = [name for name in git(top, "ls-files", "-z", "--", str(path)).stdout.split("\0") if name]
    if tracked:
        git(top, "update-index", "--skip-worktree", "--", *tracked)
    shutil.rmtree(place)


def belongs(top: Path, project: Path) -> bool:
    try:
        gitdir = Path((top / ".git").read_text().split(":", 1)[1].strip())
        gitdir = gitdir if gitdir.is_absolute() else top / gitdir
        common = (gitdir / "commondir").read_text().strip()
    except (OSError, IndexError):
        return False
    return (gitdir / common).resolve() == (project / ".git").resolve()


def ignored(project: Path, paths: list[Path], folders: WorkspaceFolders) -> list[Path]:
    if not paths:
        return []
    asked = git(project, "check-ignore", "--verbose", "--stdin", stdin="\n".join(map(str, paths)))
    managed = folders.managed
    named = {path for source, path in (line.split("\t", 1) for line in asked.stdout.splitlines() if "\t" in line)
             if not (source.split(":", 2)[0].endswith("info/exclude") and source.split(":", 2)[2].startswith(managed))}
    return [path for path in paths if str(path) in named]


def untracked(project: Path, paths: list[Path]) -> list[Path]:
    if not paths:
        return []
    tracked = [Path(name) for name in git(project, "ls-files", "-z", "--", *map(str, paths)).stdout.split("\0") if name]
    return [path for path in paths if not any(name == path or path in name.parents for name in tracked)]


def linked_to(place: Path, target: Path) -> None:
    if not target.exists() or is_linked(place, target):
        return
    if place.exists() and not place.is_symlink():
        return
    place.parent.mkdir(parents=True, exist_ok=True)
    if place.is_symlink():
        place.unlink()
    try:
        place.symlink_to(target, target_is_directory=target.is_dir())
    except FileExistsError:
        return


def is_linked(place: Path, target: Path) -> bool:
    if not place.is_symlink():
        return False
    linked = place.readlink()
    return Path(os.path.abspath(linked if linked.is_absolute() else place.parent / linked)) == target


def unshared(top: Path, project: Path, wanted: set[Path], folders: WorkspaceFolders) -> None:
    for folder in folders.shared_in:
        here = top / folder
        if not here.is_dir():
            continue
        for entry in here.iterdir():
            path = Path(folder) / entry.name
            if entry.is_symlink() and path not in wanted and project in Path(os.readlink(entry)).parents:
                entry.unlink()


def excluded(top: Path, patterns: list[str], folders: WorkspaceFolders) -> None:
    gitdir = Path((top / ".git").read_text().split(":", 1)[1].strip())
    exclude = (gitdir if gitdir.is_absolute() else top / gitdir).resolve().parents[1] / "info" / "exclude"
    ignore(exclude, patterns, folders.managed)


def ignore(exclude: Path, patterns: list[str], managed: tuple = ()) -> None:
    exclude.parent.mkdir(parents=True, exist_ok=True)
    with (exclude.parent / "exclude.lock").open("w") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        held = exclude.read_text().splitlines() if exclude.is_file() else []
        kept = [line for line in held if not line.startswith(managed) or line in patterns]
        lines = kept + [pattern for pattern in patterns if pattern not in kept]
        if lines == held:
            return
        written = exclude.with_suffix(".new")
        written.write_text("".join(f"{line}\n" for line in lines))
        os.replace(written, exclude)
