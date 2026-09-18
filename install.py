import shutil
import stat
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from migrations import run as migrate  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from skills import write as write_skills  # noqa: E402

PACKAGE = Path(__file__).resolve().parent
HOOK = PACKAGE / "hook.py"
SKILLS = {"claude": ".claude/skills", "codex": ".codex/skills"}


def alias(project: Path, root: Path) -> Path:
    f = root / "journal"
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(f'#!/bin/sh\nexec "{sys.executable}" "{PACKAGE / "journal.py"}" --root "{root}" "$@"\n')
    f.chmod(f.stat().st_mode | stat.S_IEXEC)
    bin_ = Path.home() / ".local" / "bin"
    if bin_.is_dir() and not (bin_ / "journal").exists():
        (bin_ / "journal").symlink_to(f)
    return f


def install(project: Path, root: Path | None = None) -> list[str]:
    root = root or project / ".journal"
    done = []
    for name, cls in PROVIDERS.items():
        provider = cls()
        if not provider.present(project):
            continue
        f = provider.wire(project, f"{sys.executable} {HOOK} {name} {root}")
        done.append(f"{name}: hooks in {f.relative_to(project)}")
        written = write_skills(project / SKILLS[name])
        done.append(f"{name}: {len(written)} skills in {SKILLS[name]}")
    if not done:
        return ["no agent found here: neither Claude nor Codex"]
    done.append(f"the journal command: {alias(project, root).relative_to(project)}")
    return done


def upgrade(project: Path, root: Path | None = None) -> list[str]:
    root = root or project / ".journal"
    done = []
    if (PACKAGE / ".git").is_dir() and shutil.which("git"):
        pulled = subprocess.run(["git", "-C", str(PACKAGE), "pull", "--ff-only", "-q"], capture_output=True, text=True, timeout=120)
        done.append("package pulled" if pulled.returncode == 0 else f"package not pulled: {pulled.stderr.strip()}")
    done += install(project, root)
    ran = migrate(root)
    done.append(f"migrations run: {', '.join(ran)}" if ran else "record already in shape")
    return done


if __name__ == "__main__":
    project = Path(sys.argv[2] if len(sys.argv) > 2 else ".").resolve() if len(sys.argv) > 1 and sys.argv[1] == "upgrade" else Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    for line in (upgrade if len(sys.argv) > 1 and sys.argv[1] == "upgrade" else install)(project):
        print(line)
