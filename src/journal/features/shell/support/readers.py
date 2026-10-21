from pathlib import Path
from typing import Callable

from journal.config import Config
from journal.features.shell.support.reader import Reader
from journal.features.shell.support.script_reader import ScriptReader
from journal.support.rejection import Rejection

KINDS: dict[str, Callable[[Path], Reader | ScriptReader]] = {".pattern": Reader.loaded, ".sh": ScriptReader.loaded}


class Readers:
    """The readers the project keeps in .journal/readers/, one file each, read by name."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def all(self) -> list[Reader | ScriptReader]:
        if not self.config.readers.is_dir():
            return []
        return [KINDS[path.suffix](path) for path in sorted(self.config.readers.iterdir()) if path.suffix in KINDS]

    def lookup(self, name: str) -> Reader | ScriptReader:
        rows = [path for suffix in KINDS if (path := self.config.readers / f"{name}{suffix}").is_file()]
        if not rows:
            raise Rejection(f"no reader named {name}: `journal reader list` names them")
        return KINDS[rows[0].suffix](rows[0])

    def add(self, reader: Reader) -> None:
        self.config.readers.mkdir(parents=True, exist_ok=True)
        (self.config.readers / f"{reader.name}.pattern").write_text(reader.text())

    def add_script(self, name: str, topic: str, script: Path) -> None:
        self.config.readers.mkdir(parents=True, exist_ok=True)
        (self.config.readers / f"{name}.sh").write_text(f"# {topic}\n{script.read_text()}")
