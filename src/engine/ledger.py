import json
from pathlib import Path

from resources.base import Refused


def ledger(root: Path) -> Path:
    return Path(root) / "migrations.json"


def applied(root: Path) -> dict:
    path = ledger(root)
    if not path.exists():
        return {}
    try:
        value = json.loads(path.read_text())
    except (OSError, ValueError) as error:
        raise Refused(f"damaged migrations ledger: {path}") from error
    if not isinstance(value, dict):
        raise Refused(f"damaged migrations ledger: {path}")
    return value
