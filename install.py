import os
import shutil
import stat
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from commands.cli import OVER_HTTP  # noqa: E402
from migrations import run as migrate  # noqa: E402
from features.law.policy import brief  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from skills import LIBRARY, LINKED, publish  # noqa: E402

PACKAGE = Path(__file__).resolve().parent
PACKAGE_DIRS = ("commands", "controllers", "engine", "extension", "features", "migrations", "providers", "resources", "skills", "surfaces")
PACKAGE_FILES = ("VERSION", "channel.py", "claude-status.sh", "hook.sh", "install.py", "journal.py", "serve.py", "skills.py")
PACKAGE_TREES = (*PACKAGE_DIRS, "web/dist")
LEFT_BEHIND = (".DS_Store", "test.py")
RETIRED = ("hook.py", "support")
REPOSITORY = "https://github.com/jessegall/agent-journal"
SRC = "src"


def code(root: Path) -> Path:
    return root / SRC


def package_files(root: Path, left: tuple = LEFT_BEHIND) -> set[Path]:
    files = {Path(name) for name in PACKAGE_FILES if (root / name).is_file()}
    for name in PACKAGE_TREES:
        base = root / name
        if base.is_dir():
            files.update(f.relative_to(root) for f in base.rglob("*") if f.is_file() and f.name not in left and f.suffix != ".pyc" and "__pycache__" not in f.parts)
    return files


def refresh(source: Path, target: Path) -> tuple[int, int]:
    source, target = source.resolve(), target.resolve()
    if source == target:
        return 0, 0
    wanted = package_files(source)
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
    return len(changed), len(gone)


ENTRYPOINTS = ("journal.py",)
FORWARD = 'import runpy\nimport sys\nfrom pathlib import Path\n\nsys.argv[0] = str(Path(__file__).resolve().parent / "src" / Path(__file__).name)\nrunpy.run_path(sys.argv[0], run_name="__main__")\n'


def retire(root: Path) -> int:
    old = {rel for rel in package_files(root) if str(rel) not in ENTRYPOINTS}
    for rel in old:
        (root / rel).unlink()
    for name in ENTRYPOINTS:
        (root / name).write_text(FORWARD)
    for name in (*PACKAGE_DIRS, "web"):
        tree = root / name
        if tree.is_dir() and not any(f.is_file() and "__pycache__" not in f.parts for f in tree.rglob("*")):
            shutil.rmtree(tree)
    return len(old)


ASKS = """case "$1" in __SERVED__) ;; *) false ;; esac && if read -r at url < "$root/runtime/heartbeat" 2>/dev/null && [ $(( $(date +%s) - at )) -le 5 ]; then
reply=$(printf '%s\\0' "$@" | curl -s -m 20 -w '\\n%{http_code}' -H 'Content-Type: text/plain' --url-query "actor=$JOURNAL_ACTOR" --url-query "env=$JOURNAL_ENV" --data-binary @- "${url}api/run")
said=${reply##*
}
body=${reply%
*}
case "$said" in
200) printf '%s' "$body"; exit 0 ;;
404|"") ;;
*) [ -n "$body" ] && printf '%s' "$body" >&2 || echo "! the journal server answered $said and said nothing" >&2; exit 1 ;;
esac
fi
"""
ASKS = ASKS.replace("__SERVED__", "|".join(sorted(OVER_HTTP)))

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
    return (LAUNCHER.replace("__ASKS__", ASKS).replace("__PYTHON__", python)
            .replace("__SCRIPT__", str(script)).replace("__ROOT__", str(root)))


def alias(project: Path, root: Path) -> Path:
    f = root / "journal"
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(launcher(sys.executable, code(root) / "journal.py", root))
    f.chmod(f.stat().st_mode | stat.S_IEXEC)
    bin_ = Path.home() / ".local" / "bin"
    if bin_.is_dir():
        shim = bin_ / "journal"
        shim.write_text(SHIM.replace("__ASKS__", ASKS))
        shim.chmod(shim.stat().st_mode | stat.S_IEXEC)
    return f


def install(project: Path, root: Path | None = None) -> list[str]:
    root = root or project / ".journal"
    refresh(PACKAGE, code(root))
    done = configure(project, root)
    retire(root)
    return done


def configure(project: Path, root: Path) -> list[str]:
    done = []
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


def upgrade(project: Path, root: Path | None = None) -> list[str]:
    root = root or project / ".journal"
    done = []
    source, temporary = PACKAGE, None
    reloaded = PACKAGE.resolve() in (root.resolve(), code(root).resolve()) and not os.environ.get("AGENT_JOURNAL_BOOTSTRAPPED")
    if reloaded:
        temporary = Path(tempfile.mkdtemp())
        source = temporary / "package"
        _, failed = fetch(source)
        if failed:
            shutil.rmtree(temporary, ignore_errors=True)
            return [f"package not refreshed: {failed}"]
    elif (PACKAGE / ".git").is_dir() and shutil.which("git"):
        pulled = subprocess.run(["git", "-C", str(PACKAGE), "pull", "--ff-only", "-q"], capture_output=True, text=True, timeout=120)
        done.append("package pulled" if pulled.returncode == 0 else f"package not pulled: {pulled.stderr.strip()}")
    changed, gone = refresh(source, code(root))
    if temporary:
        shutil.rmtree(temporary, ignore_errors=True)
    done.append(f"package refreshed: {changed} changed, {gone} retired")
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
        if not failed:
            refresh(temporary / "package", code(root))
        shutil.rmtree(temporary, ignore_errors=True)
        done.append(f"package files an older installer did not know: {failed or 'fetched'}")
    done += configure(project, root)
    ran = migrate(root)
    done.append(f"migrations run: {', '.join(ran)}" if ran else "record already in shape")
    moved = retire(root)
    if moved:
        done.append(f"package moved into {SRC}/: {moved} files out of the record")
    return done


def main(argv: list[str]) -> list[str]:
    word = argv[0] if argv else "install"
    if word == "upgrade":
        return upgrade(Path(argv[1] if len(argv) > 1 else ".").resolve())
    if word == "finish":
        project = Path(argv[1] if len(argv) > 1 else ".").resolve()
        return finish(project, project / ".journal")
    return install(Path(word).resolve())


if __name__ == "__main__":
    for line in main(sys.argv[1:]):
        print(line)
