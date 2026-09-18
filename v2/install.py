import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from v2.providers import PROVIDERS  # noqa: E402

HOOK = Path(__file__).resolve().parent / "hook.py"


def install(project: Path, root: Path | None = None) -> list[str]:
    root = root or project / ".journal"
    done = []
    for name, cls in PROVIDERS.items():
        provider = cls()
        if not provider.present(project):
            continue
        f = provider.wire(project, f"{sys.executable} {HOOK} {name} {root}")
        done.append(f"{name}: hooks in {f.relative_to(project)}")
    return done or ["no agent found here: neither Claude nor Codex"]


if __name__ == "__main__":
    for line in install(Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()):
        print(line)
