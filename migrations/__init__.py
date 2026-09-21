import importlib
import json
import time
from pathlib import Path
from engine.stored import write_text

HERE = Path(__file__).parent


def names() -> list[str]:
    return sorted(p.stem for p in HERE.glob("m[0-9][0-9][0-9][0-9]_*.py"))


def ledger(root: Path) -> Path:
    return Path(root) / "migrations.json"


def applied(root: Path) -> dict:
    try:
        return json.loads(ledger(root).read_text())
    except (OSError, ValueError):
        return {}


def run(root: Path) -> list[str]:
    import features
    features.load()
    root = Path(root)
    done = applied(root)
    ran = []
    for name in names():
        if name in done:
            continue
        module = importlib.import_module(f"migrations.{name}")
        result = module.run(root)
        done[name] = {"at": time.time(), "result": result}
        root.mkdir(parents=True, exist_ok=True)
        write_text(ledger(root), json.dumps(done, indent=2))
        ran.append(name)
    return ran
