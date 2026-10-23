from pathlib import Path
from typing import Callable

from journal.config import Config
from journal.repositories.aliases import Aliases
from journal.support.chain import Chain
from journal.features.shell.support.reader import Reader
from journal.features.shell.support.script_reader import ScriptReader
from journal.features.shell.support.reader_commands import COMMANDS_PREFIX, ReaderCommands
from journal.features.shell.support.output_files import OutputFiles
from journal.models.command_output import CommandOutput
from journal.support.rejection import Rejection

JOURNAL = "journal"

KINDS: dict[str, Callable[[Path], Reader | ScriptReader]] = {".pattern": Reader.loaded, ".sh": ScriptReader.loaded}


class Readers:
    """The readers the project keeps in .journal/readers/, one file each, read by name."""

    def __init__(self, config: Config, aliases: Aliases) -> None:
        self.config, self.aliases = config, aliases

    def all(self) -> list[Reader | ScriptReader]:
        if not self.config.readers.is_dir():
            return []
        return [KINDS[path.suffix](path) for path in sorted(self.config.readers.iterdir()) if path.suffix in KINDS]

    def lookup(self, name: str) -> Reader | ScriptReader:
        rows = [path for suffix in KINDS if (path := self.config.readers / f"{name}{suffix}").is_file()]
        if not rows:
            raise Rejection(f"no reader named {name}: `journal reader list` names them")
        return KINDS[rows[0].suffix](rows[0])

    def file_stamp(self, name: str) -> float:
        return max((path.stat().st_mtime for suffix in KINDS if (path := self.config.readers / f"{name}{suffix}").is_file()), default=0.0)

    def reading_output(self, name: str, output: CommandOutput) -> Reader | ScriptReader:
        reader = self.lookup(name)
        if reader.commands.programs and not any(reader.commands.is_read(line) for line in self.run_lines(output)):
            raise Rejection(f"the reader {name} reads {reader.commands.text()}, and output {output.id} is {output.headline()}: check the output's number with journal output list")
        return reader

    def run_lines(self, output: CommandOutput) -> list[str]:
        files = OutputFiles(Path(output.folder))
        commands = [output.command, *(files.part_text(i) for i in files.recorded())] if files.is_stored() else [output.command]
        return [*commands, *self.alias_lines(commands)]

    def alias_lines(self, commands: list[str]) -> list[str]:
        index = self.aliases.index()
        names = [segment.text.split()[1] for command in commands for segment in Chain.parts(command) if segment.text.split()[:1] == [JOURNAL] and len(segment.text.split()) > 1]
        return [index[name].line for name in names if name in index]

    def reading(self, line: str) -> Reader | ScriptReader | None:
        return next((reader for reader in self.all() if reader.commands.is_read(line)), None)

    def pattern_reader(self, name: str) -> Reader | None:
        path = self.config.readers / f"{name}.pattern"
        return Reader.loaded(path) if path.is_file() else None

    def add(self, reader: Reader) -> None:
        self.config.readers.mkdir(parents=True, exist_ok=True)
        (self.config.readers / f"{reader.name}.pattern").write_text(reader.text())

    def add_script(self, name: str, topic: str, script: Path, commands: ReaderCommands) -> None:
        self.config.readers.mkdir(parents=True, exist_ok=True)
        commands_line = f"# {COMMANDS_PREFIX}{commands.text()}\n" if commands.programs else ""
        (self.config.readers / f"{name}.sh").write_text(f"# {topic}\n{commands_line}{script.read_text()}")
