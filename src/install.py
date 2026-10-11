import sys

if sys.version_info < (3, 11):
    sys.exit(f"Python 3.11 or newer is needed, and this is Python {sys.version.split()[0]}")

import fcntl
import os
import shutil
import stat
import tarfile
import subprocess
import hashlib
import json
import marshal
import tempfile
import time
import zipfile
from importlib.util import MAGIC_NUMBER
from pathlib import Path
from contextlib import contextmanager
from dataclasses import dataclass
from functools import cache
from types import ModuleType
from typing import Callable


PACKAGE = Path(__file__).resolve().parent
PACKED_DIRS = ("agents", "commands", "controllers", "engine", "features", "migrations", "overview", "providers", "resources", "runner", "surfaces")
PACKAGE_DIRS = (*PACKED_DIRS, "extension", "skills")
VERSION = "VERSION"
PACKAGE_FILES = ("CHANGELOG.md", "__main__.py", "channel.py", "claude-status.sh", "hook.sh", "install.py", "output_cap.sh", "journal.py", "keeper.py", "serve.py", "supervisor.py", "skills.py", "worker.py")
PACKAGE_TREES = (*PACKAGE_DIRS, "web/dist")
LEFT_BEHIND = (".DS_Store", "test.py")
RETIRED = ("hook.py", "support")
REPOSITORY = "https://github.com/jessegall/agent-journal"
REPOSITORY_ENV = "AGENT_JOURNAL_REPO"
LOOKUP_SECONDS = 10
BOOTSTRAPPED = "AGENT_JOURNAL_BOOTSTRAPPED"
HEALED = "AGENT_JOURNAL_HEALED"
REPAIRED = "AGENT_JOURNAL_REPAIRED"
ARCHIVED = "AGENT_JOURNAL_ARCHIVED"
SRC = "src"
ARCHIVE = "journal.pyz"
UPGRADE_MARK = "upgrading"
KEPT_BUILDS = 2
KEPT_COPIES = 1
FRESH_FOR = 3600
NOT_RECORD = ("src", "runtime", "attic", "plugins", "plugin-data")
STUBS = {"journal.py": "journal", "channel.py": "channel", "serve.py": "serve", "supervisor.py": "supervisor", "engine/worker.py": "worker", "worker.py": "worker", "engine/keeper.py": "keeper", "keeper.py": "keeper"}
STUB = ("import runpy\nimport sys\nfrom pathlib import Path\n\n"
        "sys.path.insert(0, str((Path(__file__).resolve().parents[{up}] / \"{archive}\").resolve()))\nrunpy.run_module(\"{module}\", run_name=\"__main__\", alter_sys=True)\n")


def code(root: Path) -> Path:
    return root / SRC


def copy_legacy_managed(project: Path, root: Path) -> list[str]:
    managed = loaded().managed
    if (root / managed.MANAGED).is_file():
        return []
    existing = sorted(managed.managed_paths(project, root))
    if not existing or not code(root).is_dir():
        return []
    attic = root / "attic"
    attic.mkdir(parents=True, exist_ok=True)
    version = version_in(code(root), "unknown")
    copy = attic / f"before-update-{version}-{int(time.time() * 1000)}"
    for path in existing:
        destination = copy / path.relative_to(project)
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, destination)
    location = copy.relative_to(project).as_posix()
    marker = root / "runtime" / managed.LEGACY_COPY_MARKER
    marker.parent.mkdir(parents=True, exist_ok=True)
    marker.write_text(location)
    return [f"Managed files from before this update were copied to {location}"]


def archive_changed(project: Path, root: Path, changed: list[Path]) -> Path:
    attic = root / "attic"
    attic.mkdir(parents=True, exist_ok=True)
    copy = attic / f"changed-files-{int(time.time() * 1000)}.tar.gz"
    with tarfile.open(copy, "w:gz") as archive:
        for path in changed:
            if path.is_file():
                archive.add(path, arcname=path.relative_to(project).as_posix(), recursive=False)
    return copy


def layout(root: Path) -> tuple[str, ...]:
    return tuple(sorted(f"{tree.name}/dist" if tree.name == "web" else tree.name for tree in root.iterdir() if tree.is_dir() and not tree.name.startswith(("_", "."))))


def packed_dirs(src: Path) -> list[str]:
    return [name for name in layout(src) if (src / name / "__init__.py").is_file()]


def package_files(root: Path, left: tuple = LEFT_BEHIND, trees: tuple = PACKAGE_TREES) -> set[Path]:
    files = {Path(name) for name in PACKAGE_FILES if (root / name).is_file()}
    for name in trees:
        base = root / name
        if base.is_dir():
            files.update(f.relative_to(root) for f in base.rglob("*") if f.is_file() and f.name not in left and f.suffix != ".pyc" and "__pycache__" not in f.parts)
    return files


def packaged(source: Path) -> Path:
    return source / SRC if (source / SRC / "install.py").is_file() else source


def version_in(folder: Path, missing: str = "") -> str:
    return (folder / VERSION).read_text().strip() if (folder / VERSION).is_file() else missing


def version_file(package: Path) -> Path:
    return package / VERSION if (package / VERSION).is_file() else package.parent / VERSION


def refresh(source: Path, target: Path) -> tuple[set, set]:
    source, target = packaged(source).resolve(), target.resolve()
    if source == target:
        return set(), set()
    trees = layout(source)
    wanted = package_files(source, trees=trees)
    if "install.py" not in {rel.as_posix() for rel in wanted}:
        raise OSError(f"{source} holds no journal package; nothing was changed")
    if (source / "web").is_dir() and not (source / "web" / "dist" / "index.html").is_file():
        raise OSError(f"{source / 'web' / 'dist'} holds no finished viewer build, perhaps one still running; nothing was changed")
    existing = package_files(target, left=(), trees=(*dict.fromkeys((*PACKAGE_TREES, *trees)),))
    gone = existing - wanted
    changed = {rel for rel in wanted if not (target / rel).is_file() or (source / rel).read_bytes() != (target / rel).read_bytes()}
    for rel in sorted(gone):
        (target / rel).unlink()
    for name in RETIRED:
        for place in (target, target.parent):
            retired = place / name
            if retired.is_dir():
                shutil.rmtree(retired)
            else:
                retired.unlink(missing_ok=True)
    for rel in sorted(changed):
        destination = target / rel
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.unlink(missing_ok=True)
        shutil.copy2(source / rel, destination)
    release, installed = version_file(source), target / VERSION
    if release.is_file() and (not installed.is_file() or installed.read_bytes() != release.read_bytes()):
        shutil.copy2(release, installed)
        changed.add(Path(VERSION))
    return changed, gone


FORWARD = ('#!/usr/bin/env python3\nimport runpy\nimport sys\nimport time\nfrom pathlib import Path\n\nhere = Path(__file__).resolve().parent\n'
           f'packed = (here / "{ARCHIVE}").resolve()\nupdating = here / "runtime" / "{UPGRADE_MARK}"\nbegan = time.time()\n'
           'while not packed.is_file() and updating.exists() and time.time() - began < 120:\n    time.sleep(0.2)\n'
           f'    packed = (here / "{ARCHIVE}").resolve()\n'
           'sys.argv[0] = str(packed if packed.is_file() else here / "src" / "__main__.py")\nrunpy.run_path(sys.argv[0], run_name="__main__")\n')
HOOK = ('#!/usr/bin/env python3\nimport os\nimport sys\nfrom pathlib import Path\n\nroot = Path(__file__).resolve().parent\n'
        'os.execvp("sh", ["sh", str(root / "src" / "hook.sh"), *(sys.argv[1:2] or ["claude"]), str(root)])\n')
ENTRYPOINTS = {"journal.py": FORWARD, "hook.py": HOOK}


def retire(root: Path) -> int:
    old = {rel for rel in package_files(root) if str(rel) not in ENTRYPOINTS}
    for rel in old:
        (root / rel).unlink()
    for name, text in ENTRYPOINTS.items():
        (root / name).write_text(text)
        (root / name).chmod(0o755)
    for name in (*PACKAGE_DIRS, "web"):
        tree = root / name
        if tree.is_dir() and not any(f.is_file() and "__pycache__" not in f.parts for f in tree.rglob("*")):
            shutil.rmtree(tree)
    return len(old)


ASKS = """if { read -r at url < "$root/runtime/heartbeat"; } 2>/dev/null && [ $(( $(date +%s) - at )) -le 60 ]; then
session="$JOURNAL_SESSION"; [ -z "$session" ] && [ -n "$JOURNAL_SESSION_VARIABLE" ] && eval "session=\\${$JOURNAL_SESSION_VARIABLE:-}"
for __try in 1 2; do
reply=$(printf '%s\\0' "$@" | curl -s -m 20 -w '\\n%{http_code} %{time_total}' -H 'Content-Type: text/plain' --url-query "actor=$JOURNAL_ACTOR" --url-query "env=$JOURNAL_ENV" --url-query "cwd=$PWD" --url-query "plugin=$JOURNAL_PLUGIN" --url-query "session=$session" --data-binary @- "${url}api/run")
[ $? -ne 2 ] || reply=$(printf '%s\\0' "$@" | curl -s -m 20 -w '\\n%{http_code} %{time_total}' -H 'Content-Type: text/plain' --data-binary @- "$(curl -Gso /dev/null -w '%{url_effective}' --data-urlencode "actor=$JOURNAL_ACTOR" --data-urlencode "env=$JOURNAL_ENV" --data-urlencode "cwd=$PWD" --data-urlencode "plugin=$JOURNAL_PLUGIN" --data-urlencode "session=$session" "${url}api/run")")
last=${reply##*
}
said=${last%% *}
spent=${last#* }
body=${reply%
*}
case "$spent" in
[0-9]*.[0-9][0-9][0-9]*)
frac=${spent#*.}
ms=$(( ${spent%%.*} * 1000 + 1${frac%${frac#???}} - 1000 ))
if [ "$ms" -gt 50 ]; then
( curl -sG -X POST -m 2 --connect-timeout 1 -o /dev/null --data-urlencode "env=$JOURNAL_ENV" --data-urlencode "took=$ms" --data-urlencode "command=$1 $2" "${url}api/slow-command" >/dev/null 2>&1 & )
fi ;;
esac
case "$said" in 000|"") [ "$__try" = 1 ] && [ "${ms:-9999}" -lt 5000 ] && continue ;; esac
break
done
case "$said" in
200) printf '%s' "$body"; exit 0 ;;
404|409) ;;
000|"") [ "${ms:-0}" -lt 5000 ] || { echo "! the journal did not answer in $((ms / 1000)) seconds; the command may still be running, so it was not run again: look before you send it again" >&2; exit 1; } ;;
*) [ -n "$body" ] && printf '%s' "$body" >&2 || echo "! the journal server answered $said and said nothing" >&2; exit 1 ;;
esac
fi
"""


SHIM = """#!/bin/sh
dir="$(pwd)"
while [ "$dir" != "/" ]; do
for src in "$dir/.journal/src" "$dir/.journal"; do
if [ -f "$src/journal.py" ]; then
root="$dir/.journal"
__ASKS__[ -x "__PYTHON__" ] || { echo "journal: Python at __PYTHON__ is gone (moved or upgraded), so reinstall: re-run install.sh" >&2; exit 1; }
exec "__PYTHON__" "$src/journal.py" --root "$root" "$@"
fi
done
dir="$(dirname "$dir")"
done
echo "no .journal/ here or above: install agent-journal in this project first" >&2
exit 1
"""

LAUNCHER = """#!/bin/sh
root="__ROOT__"
__ASKS__[ -x "__PYTHON__" ] || { echo "journal: Python at __PYTHON__ is gone (moved or upgraded), so reinstall: re-run install.sh" >&2; exit 1; }
exec "__PYTHON__" "__SCRIPT__" --root "$root" "$@"
"""


def launcher(python: str, script: Path, root: Path) -> str:
    return (LAUNCHER.replace("__ASKS__", ASKS).replace("__PYTHON__", python)
            .replace("__SCRIPT__", str(script)).replace("__ROOT__", str(root)))


def alias(project: Path, root: Path) -> Path:
    f = root / "journal"
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(launcher(sys.executable, root / "journal.py", root))
    f.chmod(f.stat().st_mode | stat.S_IEXEC)
    bin_ = Path.home() / ".local" / "bin"
    bin_.mkdir(parents=True, exist_ok=True)
    shim = bin_ / "journal"
    shim.write_text(SHIM.replace("__ASKS__", ASKS).replace("__PYTHON__", sys.executable))
    shim.chmod(shim.stat().st_mode | stat.S_IEXEC)
    return f


ON_PATH = "# agent-journal: the journal command"


def put_on_path(bin_: Path) -> str:
    if str(bin_) in os.environ.get("PATH", "").split(os.pathsep):
        return ""
    shell = Path(os.environ.get("SHELL", "")).name
    profile = Path.home() / {"zsh": ".zshrc", "bash": ".bash_profile"}.get(shell, ".profile")
    if ON_PATH not in (profile.read_text() if profile.is_file() else ""):
        with profile.open("a") as written:
            written.write(f'\n{ON_PATH}\nexport PATH="$HOME/.local/bin:$PATH"\n')
    return f"{bin_} added to your PATH in {profile}: open a new terminal, then type journal"


@dataclass(frozen=True)
class Prepared:
    copied: list[str]
    held: str | None = None


def prepare_managed(project: Path, root: Path, yes: bool) -> Prepared:
    """Copies the managed files an older build left unrecorded, then holds the update for files changed since, or sets them aside when told yes."""
    copied = copy_legacy_managed(project, root)
    changed = loaded().managed.changed_managed(project, root)
    if changed and not yes:
        return Prepared(copied, loaded().managed.changed_message(project, changed))
    if changed:
        archive_changed(project, root, changed)
    return Prepared(copied)


def install(project: Path, root: Path | None = None, yes: bool = False) -> list[str]:
    root = root or project / ".journal"
    prepared = prepare_managed(project, root, yes)
    if prepared.held is not None:
        return [prepared.held]
    refresh(PACKAGE, code(root))
    done = configure(project, root)
    retire(root)
    loaded().managed.remember_managed(project, root)
    return prepared.copied + done


def old_git_hook(project: Path) -> list[str]:
    hook = project / ".git" / "hooks" / "post-commit"
    if hook.is_file() and "agent-journal:" in hook.read_text(errors="replace"):
        hook.unlink()
        return ["the version 1 post-commit git hook removed"]
    return []


def configure(project: Path, root: Path) -> list[str]:
    package = loaded()
    done = old_git_hook(project)
    present = []
    for name, cls in package.providers.items():
        provider = cls()
        if not provider.present(project):
            continue
        f = provider.wire(project, package.hook_command(code(root) / "hook.sh", name, root))
        done.append(f"{name}: hooks in {f.relative_to(project)}")
        present.append(name)
    if not present:
        return [*done, f"no agent found here: neither {' nor '.join(name.capitalize() for name in package.providers)}"]
    troubles = [f"hook check failed for {name}: {trouble}" for name in present for trouble in [package.providers[name]().wiring_trouble(project)] if trouble]
    done += troubles or [f"hooks checked: {', '.join(present)}"]
    written, linked = package.publish(project, tuple(present))
    done.append(f"{len(written)} skills in {package.library}" + (f", linked from {', '.join(package.linked[a] for a in present if a in package.linked)}" if linked else ""))
    record = package.record(root, package.default_env(root))
    briefing = package.brief(project, record)
    named = ' and '.join(sorted(cls.briefing_file for cls in package.providers.values() if cls.briefing_file))
    done.append(f"the journal's block in {', '.join(f.name for f in briefing.written) or named}")
    done.extend(briefing.left)
    written = package.agent_types(project, record)
    if written:
        done.append(f"agent types: {', '.join(f.stem for f in written)}")
    done.append(f"the journal command: {alias(project, root).relative_to(project)}")
    told = put_on_path(Path.home() / ".local" / "bin")
    if told:
        done.append(told)
    return done


def token() -> str:
    if not shutil.which("gh"):
        return ""
    try:
        got = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True, timeout=20)
    except (OSError, subprocess.SubprocessError):
        return ""
    return got.stdout.strip() if got.returncode == 0 else ""


def with_token(repository: str, secret: str) -> str:
    return repository.replace("https://", f"https://x-access-token:{secret}@", 1) if secret and repository.startswith("https://github.com/") else repository


def redacted(text: str, secret: str) -> str:
    return text.replace(secret, "the token") if secret else text


@cache
def listed_variables() -> frozenset[str]:
    return frozenset(subprocess.run(["git", "rev-parse", "--local-env-vars"], capture_output=True, text=True, timeout=30, env={"PATH": os.environ.get("PATH", "")}).stdout.split())


def repository_variables() -> frozenset[str]:
    try:
        return listed_variables()
    except (OSError, subprocess.TimeoutExpired):
        return frozenset()


def git_env() -> dict:
    """Drops the variables that point git at a repository, such as a hook's GIT_DIR, so git acts on the folder it runs in."""
    return {**{name: value for name, value in os.environ.items() if name not in repository_variables()}, "GIT_TERMINAL_PROMPT": "0"}


def version_key(version: str) -> tuple:
    return tuple(int(part) if part.isdigit() else 0 for part in str(version).split("."))


def repository_of(given: str | None) -> str:
    return given if given is not None else os.environ.get(REPOSITORY_ENV, REPOSITORY)


def release_versions(repository: str | None = None) -> list[str]:
    try:
        listed = subprocess.run(["git", "ls-remote", "--tags", "--refs", repository_of(repository), "v*"], capture_output=True, text=True, timeout=LOOKUP_SECONDS, env=git_env())
    except (OSError, subprocess.TimeoutExpired):
        return []
    versions = [line.rsplit("/v", 1)[1] for line in listed.stdout.splitlines() if "/v" in line] if not listed.returncode else []
    return sorted(versions, key=version_key, reverse=True)


def released(repository: str | None = None) -> str:
    return next(iter(release_versions(repository)), "")


def fetch(into: Path, repository: str | None = None, ref: str = "") -> tuple[str, str]:
    wanted = repository_of(repository)
    secret = token() if wanted.startswith("https://github.com/") else ""
    source = with_token(wanted, secret)
    try:
        into.mkdir(parents=True, exist_ok=True)
        for step in (["init", "-q"], ["fetch", "-q", "--depth", "1", source, ref or "HEAD"], ["checkout", "-q", "FETCH_HEAD"]):
            done = subprocess.run(["git", *step], cwd=into, capture_output=True, text=True, timeout=120, env=git_env())
            if done.returncode:
                return "", redacted(done.stderr.strip() or f"git {step[0]} failed", secret)
        return subprocess.run(["git", "rev-parse", "HEAD"], cwd=into, capture_output=True, text=True, timeout=30, env=git_env()).stdout.strip(), ""
    except (OSError, subprocess.TimeoutExpired) as error:
        return "", str(error)


def keep_copy(root: Path) -> str:
    if not (root / "environments").is_dir():
        return ""
    version = version_in(code(root), "unknown")
    attic = root / "attic"
    attic.mkdir(parents=True, exist_ok=True)
    kept = sorted(attic.glob("before-*.tar.gz"), key=lambda f: f.stat().st_mtime, reverse=True)
    if kept and time.time() - kept[0].stat().st_mtime < FRESH_FOR:
        line = f"the copy of the record in {kept[0].relative_to(root.parent)} is under an hour old, so no new one is made"
    else:
        copy = attic / f"before-{version}-{int(time.time())}.tar.gz"
        with tarfile.open(copy, "w:gz", compresslevel=0) as archive:
            for entry in sorted(root.iterdir()):
                if entry.name not in NOT_RECORD and not entry.name.startswith(("journal-", ARCHIVE)):
                    archive.add(entry, arcname=entry.name)
        line = f"a copy of the record is kept in {copy.relative_to(root.parent)}"
    for old in sorted(attic.glob("before-*.tar.gz"), key=lambda f: f.stat().st_mtime, reverse=True)[KEPT_COPIES:]:
        old.unlink(missing_ok=True)
    return line


def half_done(root: Path) -> bool:
    return (code(root) / "__main__.py").is_file() and (root / ARCHIVE).exists()


def upgrade(project: Path, root: Path | None = None, yes: bool = False, version: str = "") -> list[str]:
    root = root or project / ".journal"
    mark = loaded().upgrade_mark(root)
    mark.parent.mkdir(parents=True, exist_ok=True)
    with (root / "runtime" / "upgrade.lock").open("a") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except OSError:
            return ["another upgrade of this journal is running; this one stepped aside"]
        with timed(root, "check the managed files"):
            prepared = prepare_managed(project, root, yes)
        if prepared.held is not None:
            return [prepared.held]
        mark.write_text("Preparing the update")
        loaded().restarting(root).write_text(str(time.time()))
        try:
            with timed(root, "pause the agents"):
                paused = loaded().pause_agents(root)
            with timed(root, "wait for running commands"):
                waited = loaded().wait_for_commands(root, lambda text: stepping(root, text))
            lines = paused + waited + prepared.copied + upgrading(project, root, version)
            stepping(root, "Restarting the journal")
            return lines
        finally:
            mark.unlink(missing_ok=True)


@contextmanager
def timed(root: Path, step: str):
    """Writes how long a step of an upgrade took beside the others, and how much of it was the processor's own work, children included, so what dominates an update is read off the file, not guessed, and a busy machine is told from a slow step."""
    began, worked = time.perf_counter(), sum(os.times()[:4])
    try:
        yield
    finally:
        if str(PACKAGE) not in sys.path:
            sys.path.insert(0, str(PACKAGE))
        from engine.runtime import record_step
        record_step(root, step, time.perf_counter() - began, sum(os.times()[:4]) - worked, version_in(code(root)))


def stepping(root: Path, text: str) -> None:
    """Says which step the running upgrade is on, in the mark it holds, for the viewer and the status line to read."""
    if str(PACKAGE) not in sys.path:
        sys.path.insert(0, str(PACKAGE))
    from engine.runtime import upgrade_mark
    mark = upgrade_mark(root)
    if mark.exists():
        mark.write_text(text)


def installed_here(root: Path, package: Path = PACKAGE) -> bool:
    built = package.suffix == ".pyz" and package.parent == root.resolve()
    return built or package in (root.resolve(), code(root).resolve())


def upgrading(project: Path, root: Path, version: str = "") -> list[str]:
    done = []
    source, temporary, newest = PACKAGE, None, ""
    reloaded = installed_here(root) and not os.environ.get(BOOTSTRAPPED)
    if reloaded:
        stepping(root, "Fetching the new version")
        newest = version or released()
        if newest and newest == version_in(code(root)) and packed(root):
            return done + [f"package already at {newest}"] + finish(project, root)
        temporary = Path(tempfile.mkdtemp())
        source = temporary / "package"
        with timed(root, "fetch the new version"):
            _, failed = fetch(source, ref=f"refs/tags/v{newest}" if newest else "")
        if failed:
            shutil.rmtree(temporary, ignore_errors=True)
            return [f"package not refreshed: {failed}"]
    elif (PACKAGE / ".git").is_dir() and shutil.which("git"):
        with timed(root, "pull the package"):
            pulled = subprocess.run(["git", "-C", str(PACKAGE), "pull", "--ff-only", "-q"], capture_output=True, text=True, timeout=120, env=git_env())
        done.append("package pulled" if pulled.returncode == 0 else f"package not pulled: {pulled.stderr.strip()}")
    stepping(root, "Installing the new files")
    try:
        with timed(root, "copy the new files"):
            changed, gone = refresh(source, code(root))
    except OSError as error:
        return done + [f"package not refreshed: {error}"]
    finally:
        if temporary:
            shutil.rmtree(temporary, ignore_errors=True)
    done.append(f"package refreshed: {len(changed)} changed, {len(gone)} retired")
    installed = version_in(code(root))
    if newest and installed != newest:
        return done + [f"package refreshed but failed to reach the release: installed {installed or 'nothing'}, not {newest}"]
    if reloaded:
        with timed(root, "hand over to the new installer"):
            return done + handed_over(project, root)
    done += finish(project, root)
    return done


def packed(root: Path) -> bool:
    return (root / ARCHIVE).is_file() and not (code(root) / "__main__.py").is_file()


def complete(folder: Path) -> bool:
    return all((folder / name).is_file() for name in PACKAGE_FILES) and all((folder / name).is_dir() for name in PACKED_DIRS)


def handed_over(project: Path, root: Path, marks: tuple = ()) -> list[str]:
    finished = subprocess.run([sys.executable, str(code(root) / "install.py"), "finish", str(project)], capture_output=True, text=True, timeout=120,
                              env={**os.environ, BOOTSTRAPPED: "1", **dict.fromkeys(marks, "1")})
    return finished.stdout.strip().splitlines() if finished.returncode == 0 else [f"package refreshed but configuration failed: {finished.stderr.strip()}"]


def from_archive(project: Path, root: Path, built: Path) -> list[str]:
    """The rest of an install, run from the archive that was just built and is not yet the one the journal starts from: its code is compiled already, where the plain source would be compiled again by the process that packed it, and the server keeps its old build until the last step points at the new."""
    finished = subprocess.run([sys.executable, str(built), "-m", "install", "finish", str(project)], capture_output=True, text=True, timeout=300,
                              env={**os.environ, BOOTSTRAPPED: "1", ARCHIVED: "1"})
    return finished.stdout.strip().splitlines() if finished.returncode == 0 else [f"the Python is built but configuration failed: {finished.stderr.strip()}"]


def release_of(folder: Path) -> str:
    installed = version_in(folder)
    return f"refs/tags/v{installed}" if installed and "unreleased" not in installed else ""


def finish(project: Path, root: Path) -> list[str]:
    if PACKAGE.resolve() == root.resolve():
        refresh(PACKAGE, code(root))
    done = []
    if not packed(root) and not complete(code(root)) and not os.environ.get(REPAIRED):
        temporary = Path(tempfile.mkdtemp())
        _, failed = fetch(temporary / "package", ref=release_of(code(root)))
        try:
            if not failed:
                refresh(temporary / "package", code(root))
        except OSError as error:
            failed = str(error)
        shutil.rmtree(temporary, ignore_errors=True)
        done.append(f"package files an older installer did not know: {failed or 'fetched'}")
        if not failed:
            return done + handed_over(project, root, (REPAIRED,))
    if not packed(root) and not os.environ.get(ARCHIVED):
        with timed(root, "build the archive"):
            built, refused = build_archive(root)
        if built is not None:
            stepping(root, "Setting up hooks and skills")
            return done + from_archive(project, root, built)
        done.append(refused)
    stepping(root, "Setting up hooks and skills")
    with timed(root, "set up hooks, skills and briefings"):
        done += configure(project, root)
    loaded()
    from engine.package import fetch_free_threaded
    done += [line for line in [fetch_free_threaded()] if line]
    stepping(root, "Migrating the record")
    fresh = not (root / "migrations.json").is_file()
    if loaded().migrations_pending(root):
        with timed(root, "copy the record before migrating"):
            done += [line for line in [keep_copy(root)] if line]
    with timed(root, "run the migrations"):
        ran = loaded().migrate(root)
    done.append(f"migrations run: {', '.join(ran)}" if ran else "record already in shape")
    if fresh:
        done.append(loaded().mark_all_seen(root, (code(root) / "CHANGELOG.md").read_text() if (code(root) / "CHANGELOG.md").is_file() else ""))
    with timed(root, "ship the sequences and profiles"):
        done.append(loaded().ship_sequences(root))
        done.append(loaded().ship_profiles(root))
    with timed(root, "stop the sessions that ended"):
        done.append(loaded().stop_ended(root))
    moved = retire(root)
    if moved:
        done.append(f"package moved into {SRC}/: {moved} files out of the record")
    with timed(root, "pack the Python"):
        done.append(pack(root))
    with timed(root, "remember the managed files"):
        loaded().managed.remember_managed(project, root)
    return done


def python_files(src: Path, dirs: list[str]) -> list[Path]:
    top = [src / name for name in PACKAGE_FILES if name.endswith(".py") and (src / name).is_file()]
    return top + sorted(f for name in dirs if (src / name).is_dir() for f in (src / name).rglob("*.py") if "__pycache__" not in f.parts)


def compiled(source: bytes, name: str, stamp: float) -> bytes:
    code = compile(source, name, "exec", dont_inherit=True)
    return MAGIC_NUMBER + (0).to_bytes(4, "little") + int(stamp).to_bytes(4, "little") + (len(source) & 0xFFFFFFFF).to_bytes(4, "little") + marshal.dumps(code)


@dataclass(frozen=True)
class Entry:
    source: bytes
    compiled: bytes
    moment: tuple


def previous_entries(root: Path) -> dict[str, Entry]:
    """What the archive the journal runs from already holds, so an upgrade compiles only the files that changed."""
    built = (root / ARCHIVE).resolve()
    if not built.is_file():
        return {}
    try:
        with zipfile.ZipFile(built) as archive:
            names = set(archive.namelist())
            return {name: Entry(archive.read(name), archive.read(f"{name[:-3]}.pyc"), archive.getinfo(name).date_time)
                    for name in sorted(names) if name.endswith(".py") and f"{name[:-3]}.pyc" in names}
    except (OSError, zipfile.BadZipFile, KeyError):
        return {}


LOADS = "import sys; sys.path.insert(0, sys.argv[1]); import features; features.load(); import commands.cli, serve"


def start_refused(built: Path, root: Path) -> str:
    """Whether the new archive loads: its features and its command line and server import from it, in a process of its own that asks no server, so a slow or absent server never sets how long the check takes."""
    started = subprocess.run([sys.executable, "-c", LOADS, str(built)], cwd=root.parent, capture_output=True, text=True, timeout=120)
    if started.returncode == 0:
        return ""
    return started.stderr.strip()[-300:] or f"it exited with {started.returncode} and printed nothing"


def build_archive(root: Path) -> tuple[Path | None, str]:
    """The archive of the Python in src/, built with its bytecode compiled and tried once, and not yet pointed at: the build, or why there is none."""
    src = code(root)
    dirs = packed_dirs(src)
    files = python_files(src, dirs)
    with timed(root, "pack: hash the files"):
        digest = hashlib.sha256(b"".join(f.relative_to(src).as_posix().encode() + f.read_bytes() for f in files)).hexdigest()[:10]
    target = root / f"journal-{version_in(src, '0')}-{digest}.pyz"
    if target.is_file():
        return target, ""
    built = target.with_suffix(".new")
    stamp = int(time.time()) // 2 * 2
    moment = time.localtime(stamp)[:6]
    with timed(root, "pack: read the build it replaces"):
        kept = previous_entries(root)
    with timed(root, "pack: write the archive"), zipfile.ZipFile(built, "w", zipfile.ZIP_DEFLATED) as archive:
        for f in files:
            name = f.relative_to(src).as_posix()
            source = f.read_bytes()
            held = kept.get(name)
            unchanged = held is not None and held.source == source and held.compiled[:4] == MAGIC_NUMBER
            archive.writestr(zipfile.ZipInfo(name, held.moment if unchanged else moment), source)
            archive.writestr(zipfile.ZipInfo(name[:-3] + ".pyc", held.moment if unchanged else moment),
                             held.compiled if unchanged else compiled(source, str(root / ARCHIVE / name), stamp))
        archive.writestr(zipfile.ZipInfo(VERSION, moment), version_in(src, "0"))
    with timed(root, "pack: start the archive once"):
        refused = start_refused(built, root)
    if refused:
        built.unlink(missing_ok=True)
        return None, f"{ARCHIVE} not built, the journal still runs from {SRC}/: {refused}"
    built.replace(target)
    return target, ""


def pack(root: Path) -> str:
    src = code(root)
    if not (src / "__main__.py").is_file():
        return f"the Python is already in {ARCHIVE}"
    target, refused = build_archive(root)
    if target is None:
        return refused
    dirs = packed_dirs(src)
    files = python_files(src, dirs)
    point, held_builds = light()
    with timed(root, "pack: point at the build"):
        point(root, target)
    held = held_builds(root)
    for old in sorted(root.glob("journal-*.pyz"), key=lambda f: f.stat().st_mtime, reverse=True)[KEPT_BUILDS:]:
        if old != target and old.name not in held:
            old.unlink(missing_ok=True)
    with timed(root, "pack: clear the unpacked files"):
        clear_unpacked(src, files, dirs)
    for name, module in STUBS.items():
        stub = src / name
        stub.parent.mkdir(parents=True, exist_ok=True)
        stub.write_text(STUB.format(up=len(Path(name).parts), archive=ARCHIVE, module=module))
    return f"the Python is packed into {ARCHIVE}: {len(files)} files in one"


def clear_unpacked(src: Path, files: list[Path], dirs: list[str]) -> None:
    for f in files:
        f.unlink()
    for name in dirs:
        for cache in sorted((src / name).rglob("__pycache__"), reverse=True) if (src / name).is_dir() else ():
            shutil.rmtree(cache, ignore_errors=True)
        for folder in sorted((p for p in (src / name).rglob("*") if p.is_dir()), key=lambda p: len(p.parts), reverse=True) if (src / name).is_dir() else ():
            if not any(folder.iterdir()):
                folder.rmdir()
        if (src / name).is_dir() and not any((src / name).iterdir()):
            (src / name).rmdir()


def main(argv: list[str]) -> list[str]:
    word = argv[0] if argv else "install"
    if word == "upgrade":
        target = argv[argv.index("--to") + 1] if "--to" in argv else ""
        return upgrade(Path(next((arg for arg in argv[1:] if arg not in ("--yes", "--to", target)), ".")).resolve(), yes="--yes" in argv, version=target)
    if word == "finish":
        project = Path(argv[1] if len(argv) > 1 else ".").resolve()
        return finish(project, project / ".journal")
    return install(Path(word).resolve())



def heal() -> None:
    if (PACKAGE / SRC / "install.py").is_file():
        os.execv(sys.executable, [sys.executable, str(PACKAGE / SRC / "install.py"), *sys.argv[1:]])
    temporary = Path(tempfile.mkdtemp())
    try:
        _, failed = fetch(temporary / "package")
        if failed:
            sys.exit(f"the journal's package is missing beside {PACKAGE} and could not be fetched: {failed}")
        refresh(temporary / "package", PACKAGE)
    finally:
        shutil.rmtree(temporary, ignore_errors=True)
    os.execve(sys.executable, [sys.executable, str(PACKAGE / "install.py"), *sys.argv[1:]], {**os.environ, HEALED: "1"})


@dataclass(frozen=True)
class Package:
    providers: dict
    hook_command: type
    library: str
    linked: dict
    agent_types: Callable
    record: type
    default_env: Callable
    served: Callable
    point: Callable
    held_builds: Callable
    brief: Callable
    migrate: Callable
    ship_sequences: Callable
    ship_profiles: Callable
    stop_ended: Callable
    publish: Callable
    upgrade_mark: Callable
    pause_agents: Callable
    wait_for_commands: Callable
    mark_all_seen: Callable
    migrations_pending: Callable
    restarting: Callable
    managed: ModuleType


def light() -> tuple:
    """What building the archive needs of the package, imported alone, so the new code is not compiled from source just to be packed: the pointer to a build and the builds in use."""
    if str(PACKAGE) not in sys.path:
        sys.path.insert(0, str(PACKAGE))
    from engine.package import point
    from engine.sessions import held_builds
    return point, held_builds


@cache
def loaded() -> Package:
    sys.path.insert(0, str(PACKAGE))
    from commands.cli import served
    from engine.package import point
    from engine.sessions import held_builds
    from features.journal_laws.briefing import brief
    from features.sequences.shipped import ship
    from features.form_of_address.controller import ship as ship_profiles
    from features.agent_sessions.handlers import stop_ended
    from migrations import run as migrate
    from migrations import pending
    from engine.ledger import applied
    from migrations import shipped
    from providers import PROVIDERS
    from providers.base import LIBRARY, HookCommand
    from skills import LINKED, publish
    from features.boards.agent_types import written as agent_types
    from engine.record import Record
    from engine.runtime import default_env, restarting, upgrade_mark
    from features.journal_laws import managed
    from features.auto_update.new_feature import mark_all_seen
    from features.auto_update.pausing import pause_all as pause_agents
    from features.auto_update.waiting import wait_for_commands
    return Package(providers=PROVIDERS, hook_command=HookCommand, library=LIBRARY, linked=LINKED, agent_types=agent_types, record=Record, default_env=default_env,
                   served=served, point=point, held_builds=held_builds, brief=brief, migrate=migrate, ship_sequences=lambda root: shipped(root, ship, "system sequences"),
                   ship_profiles=lambda root: shipped(root, ship_profiles, "profiles"), stop_ended=stop_ended,
                   publish=publish, upgrade_mark=upgrade_mark, pause_agents=pause_agents, wait_for_commands=wait_for_commands, mark_all_seen=mark_all_seen,
                   migrations_pending=lambda root: bool(pending(applied(root))), restarting=restarting, managed=managed)


if __name__ == "__main__":
    try:
        light() if sys.argv[1:2] == ["finish"] and not os.environ.get(ARCHIVED) and not packed(Path(sys.argv[2] if len(sys.argv) > 2 else ".").resolve() / ".journal") else loaded()
    except ImportError:
        if os.environ.get(HEALED):
            raise
        heal()
    for line in main(sys.argv[1:]):
        print(line)
