from collections import defaultdict
from pathlib import Path

from controllers.plugins import Plugins
from controllers.types import environment_records
from features.plugins.declared import called
from resources.base import SYSTEM


def run(root: Path) -> list[str]:
    """Folds every plugin installed more than once into one row: the one still installed, or else the newest; the other copies go."""
    records = list(environment_records(Path(root)))
    if not records:
        return []
    plugins = Plugins(records[0], actor=SYSTEM)
    copies = defaultdict(list)
    for row in plugins.rows.every(deleted=True):
        copies[called(row)].append(row)
    return [line for name, rows in copies.items() if len(rows) > 1 for line in folded(plugins, name, rows)]


def folded(plugins: Plugins, name: str, rows: list) -> list[str]:
    kept = next((row for row in rows if not row.completed and not row.deleted), max(rows, key=lambda row: row.n))
    gone = [row for row in rows if row.n != kept.n]
    for row in gone:
        plugins.rows.remove(row.n)
    return [f"plugin {kept.n}, {name}, is installed once: its copies {', '.join(str(row.n) for row in gone)} are folded into it"]
