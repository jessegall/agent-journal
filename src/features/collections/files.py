import mimetypes
from dataclasses import asdict, dataclass

from engine.paths import contained
from engine.record import Record


@dataclass(frozen=True)
class HeldFile:
    ref: str
    type: str
    n: int
    env: str
    title: str
    name: str
    description: str
    size: int
    image: bool


def files_of(record: Record, row) -> list[HeldFile]:
    """The files attached to one row, each with its size, read from the environment the row lives in."""
    home = Record(record.root, row.home_env or record.env)
    folder = home.folder(row.type, row.scope).joinpath(f"{row.n:03d}")
    held = []
    for name, description in sorted(row.files.items()):
        file = contained(folder, name)
        if file.is_file():
            held.append(HeldFile(row.ref, row.type, row.n, row.home_env, row.title, name, description, file.stat().st_size,
                                 (mimetypes.guess_type(name)[0] or "").startswith("image/")))
    return held


def collected_files(record: Record, rows: list) -> list[dict]:
    """The files of a collection and of every row it holds, in the order the rows are given."""
    return [asdict(held) for row in rows for held in files_of(record, row)]
