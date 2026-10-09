import shutil
from pathlib import Path

from controllers.types import environment_records
from engine.paths import contained
from features.collections.controller import Collections
from features.dumps.controller import Dumps
from resources.base import Ref, SYSTEM


def copied(source: Path, target: Path) -> None:
    if source.is_dir():
        shutil.copytree(source, target, dirs_exist_ok=True)
        return
    shutil.copy2(source, target)


def filed(dumps: Dumps, collections: Collections, dump) -> list[str]:
    """Copies the files of one dump that its collection lacks and writes the collection once; names each file copied."""
    found = next(iter(Ref.numbers_of(Collections.resource.type, dump.refs)), 0)
    if not found:
        return []
    collection = collections.load(found)
    missing = {name: description for name, description in dump.files.items() if name not in collection.files}
    if not missing:
        return []
    folder = collections.rows.row_folder(found)
    folder.mkdir(exist_ok=True)
    for name, description in missing.items():
        copied(contained(dumps.rows.row_folder(dump.n), name), contained(folder, name))
        collection.files[name] = description
    collections.rows.write_file(collection)
    return [f"{dump.ref} file {name} is in {Collections.resource.type}:{found}" for name in missing]


def run(root: Path) -> list[str]:
    """Copies the files of every dump into its collection in one pass, writing each collection once and raising no event."""
    return [f"{record.env} {line}" for record in environment_records(Path(root))
            for dump in Dumps(record, actor=SYSTEM).rows.every()
            for line in filed(Dumps(record, actor=SYSTEM), Collections(record, actor=SYSTEM), dump)]
