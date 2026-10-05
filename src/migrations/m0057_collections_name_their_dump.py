from pathlib import Path

from controllers.types import environment_records
from features.collections.controller import Collections
from resources.base import SYSTEM


def made_by(collection) -> list[str]:
    return [ref for ref in collection.refs if collection.abstract == f"Everything {ref.replace(':', ' ')} was filed into"]


def run(root: Path) -> list[str]:
    named = []
    for record in environment_records(Path(root)):
        collections = Collections(record, actor=SYSTEM)
        for collection, source in [(c, ref) for c in collections.rows.every() if not c.source for ref in made_by(c)]:
            collections.update(collection.n, source=source)
            named.append(f"{record.env} {collection.ref} came from {source}")
    return named
