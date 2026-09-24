import fcntl
import os
import shutil
import stat
import tarfile
import subprocess
import sys
import hashlib
import importlib
import marshal
import tempfile
import time
import zipfile
from importlib.util import MAGIC_NUMBER
from pathlib import Path


PACKAGE = Path(__file__).resolve().parent
PACKAGE_DIRS = ("commands", "controllers", "engine", "extension", "features", "migrations", "providers", "resources", "skills", "surfaces")
PACKAGE_FILES = ("VERSION", "CHANGELOG.md", "__main__.py", "channel.py", "claude-status.sh", "hook.sh", "install.py", "output_cap.sh", "journal.py", "serve.py", "supervisor.py", "skills.py")
PACKAGE_TREES = (*PACKAGE_DIRS, "web/dist")
LEFT_BEHIND = (".DS_Store", "test.py")
RETIRED = ("hook.py", "support")
REPOSITORY = "https://github.com/jessegall/agent-journal"
SRC = "src"
ARCHIVE = "journal.pyz"
KEPT_BUILDS = 2
KEPT_COPIES = 2
NOT_RECORD = ("src", "runtime", "attic", "plugins", "plugin-data")
STUBS = {"journal.py": "journal", "channel.py": "channel", "serve.py": "serve", "supervisor.py": "supervisor", "engine/worker.py": "engine.worker", "engine/keeper.py": "engine.keeper"}
STUB = ("import runpy\nimport sys\nfrom pathlib import Path\n\n"
        "sys.path.insert(0, str((Path(__file__).resolve().parents[{up}] / \"{archive}\").resolve()))\nrunpy.run_module(\"{module}\", run_name=\"__main__\", alter_sys=True)\n")
PACKED_DIRS = ("commands", "controllers", "engine", "features", "migrations", "providers", "resources", "surfaces")


def code(root: Path) -> Path:
    return root / SRC


def package_files(root: Path, left: tuple = LEFT_BEHIND) -> set[Path]:
    files = {Path(name) for name in PACKAGE_FILES if (root / name).is_file()}
    for name in PACKAGE_TREES:
        base = root / name
        if base.is_dir():
            files.update(f.relative_to(root) for f in base.rglob("*") if f.is_file() and f.name not in left and f.suffix != ".pyc" and "__pycache__" not in f.parts)
    return files


def packaged(source: Path) -> Path:
    return source / SRC if (source / SRC / "install.py").is_file() else source


def refresh(source: Path, target: Path) -> tuple[set, set]:
    source, target = packaged(source).resolve(), target.resolve()
    if source == target:
        return set(), set()
    wanted = package_files(source)
    if "install.py" not in {rel.as_posix() for rel in wanted}:
        raise OSError(f"{source} holds no journal package; nothing was changed")
    if (source / "web").is_dir() and not (source / "web" / "dist" / "index.html").is_file():
        raise OSError(f"{source / 'web' / 'dist'} holds no finished viewer build, perhaps one still running; nothing was changed")
    existing = package_files(target, left=())
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
    return changed, gone


FORWARD = ('#!/usr/bin/env python3\nimport runpy\nimport sys\nfrom pathlib import Path\n\nhere = Path(__file__).resolve().parent\n'
           f'packed = (here / "{ARCHIVE}").resolve()\nsys.argv[0] = str(packed if packed.is_file() else here / "src" / "__main__.py")\n'
           'runpy.run_path(sys.argv[0], run_name="__main__")\n')
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


ASKS = """case "$1" in __SERVED__) ;; *) false ;; esac && if { read -r at url < "$root/runtime/heartbeat"; } 2>/dev/null && [ $(( $(date +%s) - at )) -le 5 ]; then
session="$JOURNAL_SESSION"; [ -z "$session" ] && [ -n "$JOURNAL_SESSION_VARIABLE" ] && eval "session=\\${$JOURNAL_SESSION_VARIABLE:-}"
reply=$(printf '%s\\0' "$@" | curl -s -m 20 -w '\\n%{http_code}' -H 'Content-Type: text/plain' --url-query "actor=$JOURNAL_ACTOR" --url-query "env=$JOURNAL_ENV" --url-query "cwd=$PWD" --url-query "plugin=$JOURNAL_PLUGIN" --url-query "session=$session" --data-binary @- "${url}api/run")
said=${reply##*
}
body=${reply%
*}
case "$said" in
200) printf '%s' "$body"; exit 0 ;;
404|000|"") ;;
*) [ -n "$body" ] && printf '%s' "$body" >&2 || echo "! the journal server answered $said and said nothing" >&2; exit 1 ;;
esac
fi
"""


def asks() -> str:
    return ASKS.replace("__SERVED__", "|".join(sorted(served())))

SHIM = """#!/bin/sh
dir="$(pwd)"
while [ "$dir" != "/" ]; do
for src in "$dir/.journal/src" "$dir/.journal"; do
if [ -f "$src/journal.py" ]; then
root="$dir/.journal"
__ASKS__exec python3 "$src/journal.py" --root "$root" "$@"
fi
done
dir="$(dirname "$dir")"
done
echo "no .journal/ here or above: install agent-journal in this project first" >&2
exit 1
"""

LAUNCHER = """#!/bin/sh
root="__ROOT__"
__ASKS__exec "__PYTHON__" "__SCRIPT__" --root "$root" "$@"
"""


def launcher(python: str, script: Path, root: Path) -> str:
    return (LAUNCHER.replace("__ASKS__", asks()).replace("__PYTHON__", python)
            .replace("__SCRIPT__", str(script)).replace("__ROOT__", str(root)))


def alias(project: Path, root: Path) -> Path:
    f = root / "journal"
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(launcher(sys.executable, root / "journal.py", root))
    f.chmod(f.stat().st_mode | stat.S_IEXEC)
    bin_ = Path.home() / ".local" / "bin"
    if bin_.is_dir():
        shim = bin_ / "journal"
        shim.write_text(SHIM.replace("__ASKS__", asks()))
        shim.chmod(shim.stat().st_mode | stat.S_IEXEC)
    return f


def install(project: Path, root: Path | None = None) -> list[str]:
    root = root or project / ".journal"
    refresh(PACKAGE, code(root))
    done = configure(project, root)
    retire(root)
    return done


def old_git_hook(project: Path) -> list[str]:
    hook = project / ".git" / "hooks" / "post-commit"
    if hook.is_file() and "agent-journal:" in hook.read_text(errors="replace"):
        hook.unlink()
        return ["the version 1 post-commit git hook removed"]
    return []


def configure(project: Path, root: Path) -> list[str]:
    done = old_git_hook(project)
    present = []
    for name, cls in PROVIDERS.items():
        provider = cls()
        if not provider.present(project):
            continue
        f = provider.wire(project, f"sh {code(root) / 'hook.sh'} {name} {root}")
        done.append(f"{name}: hooks in {f.relative_to(project)}")
        present.append(name)
    if not done:
        return ["no agent found here: neither Claude nor Codex"]
    written, linked = publish(project, tuple(present))
    done.append(f"{len(written)} skills in {LIBRARY}" + (f", linked from {', '.join(LINKED[a] for a in present if a in LINKED)}" if linked else ""))
    written = brief(project)
    done.append(f"the journal's law in {', '.join(f.name for f in written) or 'AGENTS.md and CLAUDE.md'}")
    done.append(f"the journal command: {alias(project, root).relative_to(project)}")
    return done


def token() -> str:
    if not shutil.which("gh"):
        return ""
    try:
        got = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True, timeout=20)
    except (OSError, subprocess.SubprocessError):
        return ""
    return got.stdout.strip() if got.returncode == 0 else ""


def reachable(repository: str, secret: str) -> str:
    return repository.replace("https://", f"https://x-access-token:{secret}@", 1) if secret and repository.startswith("https://github.com/") else repository


def plain(text: str, secret: str) -> str:
    return text.replace(secret, "the token") if secret else text


def counted(version: str) -> tuple:
    return tuple(int(part) if part.isdigit() else 0 for part in str(version).split("."))


def released(repository: str = REPOSITORY) -> str:
    try:
        listed = subprocess.run(["git", "ls-remote", "--tags", "--refs", repository, "v*"], capture_output=True, text=True, timeout=10)
    except (OSError, subprocess.TimeoutExpired):
        return ""
    versions = [line.rsplit("/v", 1)[1] for line in listed.stdout.splitlines() if "/v" in line] if not listed.returncode else []
    return max(versions, key=counted) if versions else ""


def fetch(into: Path, repository: str = "", ref: str = "") -> tuple[str, str]:
    wanted = repository or os.environ.get("AGENT_JOURNAL_REPO", REPOSITORY)
    secret = token() if wanted.startswith("https://github.com/") else ""
    source = reachable(wanted, secret)
    into.mkdir(parents=True, exist_ok=True)
    try:
        for step in (["init", "-q"], ["fetch", "-q", "--depth", "1", source, ref or "HEAD"], ["checkout", "-q", "FETCH_HEAD"]):
            done = subprocess.run(["git", *step], cwd=into, capture_output=True, text=True, timeout=120)
            if done.returncode:
                return "", plain(done.stderr.strip() or f"git {step[0]} failed", secret)
        return subprocess.run(["git", "rev-parse", "HEAD"], cwd=into, capture_output=True, text=True, timeout=30).stdout.strip(), ""
    except (OSError, subprocess.TimeoutExpired) as error:
        return "", str(error)


def keep_copy(root: Path) -> str:
    if not (root / "environments").is_dir():
        return ""
    version = (code(root) / "VERSION").read_text().strip() if (code(root) / "VERSION").is_file() else "unknown"
    attic = root / "attic"
    attic.mkdir(parents=True, exist_ok=True)
    copy = attic / f"before-{version}-{int(time.time())}.tar.gz"
    with tarfile.open(copy, "w:gz") as archive:
        for entry in sorted(root.iterdir()):
            if entry.name not in NOT_RECORD and not entry.name.startswith(("journal-", ARCHIVE)):
                archive.add(entry, arcname=entry.name)
    for old in sorted(attic.glob("before-*.tar.gz"), key=lambda f: f.stat().st_mtime, reverse=True)[KEPT_COPIES:]:
        old.unlink(missing_ok=True)
    return f"a copy of the record is kept in {copy.relative_to(root.parent)}"


def half_done(root: Path) -> bool:
    return (code(root) / "__main__.py").is_file() and (root / ARCHIVE).exists()


def upgrade(project: Path, root: Path | None = None) -> list[str]:
    root = root or project / ".journal"
    mark = root / "runtime" / "upgrading"
    mark.parent.mkdir(parents=True, exist_ok=True)
    with (root / "runtime" / "upgrade.lock").open("a") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except OSError:
            return ["another upgrade of this journal is running; this one stepped aside"]
        mark.touch()
        try:
            return upgrading(project, root)
        finally:
            mark.unlink(missing_ok=True)


def upgrading(project: Path, root: Path) -> list[str]:
    done = [line for line in [keep_copy(root)] if line]
    source, temporary, newest = PACKAGE, None, ""
    reloaded = PACKAGE.resolve() in (root.resolve(), code(root).resolve(), (root / ARCHIVE).resolve()) and not os.environ.get("AGENT_JOURNAL_BOOTSTRAPPED")
    if reloaded:
        newest = released(os.environ.get("AGENT_JOURNAL_REPO", REPOSITORY))
        temporary = Path(tempfile.mkdtemp())
        source = temporary / "package"
        _, failed = fetch(source, ref=f"refs/tags/v{newest}" if newest else "")
        if failed:
            shutil.rmtree(temporary, ignore_errors=True)
            return [f"package not refreshed: {failed}"]
    elif (PACKAGE / ".git").is_dir() and shutil.which("git"):
        pulled = subprocess.run(["git", "-C", str(PACKAGE), "pull", "--ff-only", "-q"], capture_output=True, text=True, timeout=120)
        done.append("package pulled" if pulled.returncode == 0 else f"package not pulled: {pulled.stderr.strip()}")
    try:
        changed, gone = refresh(source, code(root))
    except OSError as error:
        return done + [f"package not refreshed: {error}"]
    finally:
        if temporary:
            shutil.rmtree(temporary, ignore_errors=True)
    done.append(f"package refreshed: {len(changed)} changed, {len(gone)} retired")
    installed = (code(root) / "VERSION").read_text().strip() if (code(root) / "VERSION").is_file() else ""
    if newest and installed != newest:
        return done + [f"package refreshed but failed to reach the release: installed {installed or 'nothing'}, not {newest}"]
    if reloaded:
        finished = subprocess.run([sys.executable, str(code(root) / "install.py"), "finish", str(project)], capture_output=True, text=True, timeout=120)
        return done + (finished.stdout.strip().splitlines() if finished.returncode == 0 else [f"package refreshed but configuration failed: {finished.stderr.strip()}"])
    done += finish(project, root)
    return done


def finish(project: Path, root: Path) -> list[str]:
    if PACKAGE.resolve() == root.resolve():
        refresh(PACKAGE, code(root))
    done = []
    if not all((code(root) / name).is_file() for name in PACKAGE_FILES) and not os.environ.get("AGENT_JOURNAL_BOOTSTRAPPED"):
        temporary = Path(tempfile.mkdtemp())
        _, failed = fetch(temporary / "package")
        try:
            if not failed:
                refresh(temporary / "package", code(root))
        except OSError as error:
            failed = str(error)
        shutil.rmtree(temporary, ignore_errors=True)
        done.append(f"package files an older installer did not know: {failed or 'fetched'}")
    done += configure(project, root)
    ran = migrate(root)
    done.append(f"migrations run: {', '.join(ran)}" if ran else "record already in shape")
    moved = retire(root)
    if moved:
        done.append(f"package moved into {SRC}/: {moved} files out of the record")
    done.append(pack(root))
    return done


def python_files(src: Path) -> list[Path]:
    top = [src / name for name in PACKAGE_FILES if name.endswith(".py") and (src / name).is_file()]
    return top + sorted(f for name in PACKED_DIRS if (src / name).is_dir() for f in (src / name).rglob("*.py") if "__pycache__" not in f.parts)


def compiled(source: bytes, name: str, stamp: float) -> bytes:
    code = compile(source, name, "exec", dont_inherit=True)
    return MAGIC_NUMBER + (0).to_bytes(4, "little") + int(stamp).to_bytes(4, "little") + (len(source) & 0xFFFFFFFF).to_bytes(4, "little") + marshal.dumps(code)


def pack(root: Path) -> str:
    src = code(root)
    files = python_files(src)
    if not (src / "__main__.py").is_file():
        return f"the Python is already in {ARCHIVE}"
    digest = hashlib.sha256(b"".join(f.relative_to(src).as_posix().encode() + f.read_bytes() for f in files)).hexdigest()[:10]
    version = (src / "VERSION").read_text().strip() if (src / "VERSION").is_file() else "0"
    target = root / f"journal-{version}-{digest}.pyz"
    if not target.is_file():
        built = target.with_suffix(".new")
        stamp = int(time.time()) // 2 * 2
        moment = time.localtime(stamp)[:6]
        with zipfile.ZipFile(built, "w", zipfile.ZIP_DEFLATED) as archive:
            for f in files:
                name = f.relative_to(src).as_posix()
                source = f.read_bytes()
                archive.writestr(zipfile.ZipInfo(name, moment), source)
                archive.writestr(zipfile.ZipInfo(name[:-3] + ".pyc", moment), compiled(source, str(target / name), stamp))
        started = subprocess.run([sys.executable, str(built), "--root", str(root), "version"], cwd=root.parent, capture_output=True, text=True, timeout=120)
        if started.returncode != 0:
            built.unlink(missing_ok=True)
            return f"{ARCHIVE} not built, the journal still runs from {SRC}/: {started.stderr.strip()[-300:]}"
        built.replace(target)
    point(root, target)
    held = held_builds(root)
    for old in sorted(root.glob("journal-*.pyz"), key=lambda f: f.stat().st_mtime, reverse=True)[KEPT_BUILDS:]:
        if old != target and old.name not in held:
            old.unlink(missing_ok=True)
    for f in files:
        f.unlink()
    for name in PACKED_DIRS:
        for cache in sorted((src / name).rglob("__pycache__"), reverse=True) if (src / name).is_dir() else ():
            shutil.rmtree(cache, ignore_errors=True)
        for folder in sorted((p for p in (src / name).rglob("*") if p.is_dir()), key=lambda p: len(p.parts), reverse=True) if (src / name).is_dir() else ():
            if not any(folder.iterdir()):
                folder.rmdir()
        if (src / name).is_dir() and not any((src / name).iterdir()):
            (src / name).rmdir()
    for name, module in STUBS.items():
        stub = src / name
        stub.parent.mkdir(parents=True, exist_ok=True)
        stub.write_text(STUB.format(up=len(Path(name).parts), archive=ARCHIVE, module=module))
    return f"the Python is packed into {ARCHIVE}: {len(files)} files in one"


def main(argv: list[str]) -> list[str]:
    word = argv[0] if argv else "install"
    if word == "upgrade":
        return upgrade(Path(argv[1] if len(argv) > 1 else ".").resolve())
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


def package() -> dict:
    sys.path.insert(0, str(PACKAGE))
    from commands.cli import served
    from engine.package import point
    from engine.sessions import held_builds
    from features.journal_laws.policy import brief
    from migrations import run as migrate
    from providers import PROVIDERS
    from providers.base import LIBRARY
    from skills import LINKED, publish
    return {"served": served, "point": point, "held_builds": held_builds, "brief": brief, "migrate": migrate, "PROVIDERS": PROVIDERS,
            "LIBRARY": LIBRARY, "LINKED": LINKED, "publish": publish}


try:
    globals().update(package())
except ImportError:
    if __name__ != "__main__":
        raise
    heal()
    for name in [name for name in sys.modules if name.split(".")[0] in (*PACKAGE_DIRS, "skills")]:
        del sys.modules[name]
    importlib.invalidate_caches()
    globals().update(package())

if __name__ == "__main__":
    for line in main(sys.argv[1:]):
        print(line)
