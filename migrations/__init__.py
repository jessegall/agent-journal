import importlib
import json
import re
import time
from pathlib import Path
from engine.package import modules
from engine.stored import read_json, write_text



def names() -> list[str]:
    return [name for name, _ in modules("migrations") if re.fullmatch(r"m\d{4}_\w+", name)]


def ledger(root: Path) -> Path:
    return Path(root) / "migrations.json"


def applied(root: Path) -> dict:
    return read_json(ledger(root), {})


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
