from journal.config import Config
from journal.features.shell.reader import Reader
from journal.refused import Refused

SUFFIX = ".pattern"


class Readers:
    """The readers the project keeps in .journal/readers/, one file each, read by name."""

    def __init__(self, config: Config) -> None:
        self.config = config

    def all(self) -> list[Reader]:
        if not self.config.readers.is_dir():
            return []
        return [Reader.from_file(path) for path in sorted(self.config.readers.glob(f"*{SUFFIX}"))]

    def named(self, name: str) -> Reader:
        path = self.config.readers / f"{name}{SUFFIX}"
        if not path.is_file():
            raise Refused(f"no reader named {name}: `journal reader list` names them")
        return Reader.from_file(path)

    def add(self, reader: Reader) -> None:
        self.config.readers.mkdir(parents=True, exist_ok=True)
        (self.config.readers / f"{reader.name}{SUFFIX}").write_text(reader.text())
