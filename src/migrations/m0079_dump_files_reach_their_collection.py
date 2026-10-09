from pathlib import Path

from controllers.types import environment_records
from features.collections.controller import Collections
from features.dumps.controller import Dumps
from resources.base import Ref, SYSTEM


def run(root: Path) -> list[str]:
    copied = []
    for record in environment_records(Path(root)):
        dumps, collections = Dumps(record, actor=SYSTEM), Collections(record, actor=SYSTEM)
        for dump in dumps.rows.every():
            found = next(iter(Ref.numbers_of(Collections.resource.type, dump.refs)), 0)
            if not found:
                continue
            missing = {name: description for name, description in dump.files.items() if name not in collections.load(found).files}
            for name, description in missing.items():
                collections.attach(found, str(dumps.folder(dump.n) / name), description)
                copied.append(f"{record.env} {dump.ref} file {name} is in {Collections.resource.type}:{found}")
    return copied
