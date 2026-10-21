"""A test helper, not a test: drives the server's shell runner pieces as the old shell verbs did, so a test can split, cap, record and end a chain without a shell."""
from pathlib import Path

from journal.features.shell.support.changed_file import ChangedFile
from journal.features.shell.support.foreground_limit import ForegroundLimit
from journal.features.shell.support.output_cap import OutputCap
from journal.features.shell.support.output_files import OutputFiles
from journal.features.shell.support.shell_record import ShellRecord
from journal.repositories.command_outputs import CommandOutputs
from journal.support.chain import Chain
from journal.support.scope import Scope
from journal.support.caller import Caller


class ShellVerbs:
    def __init__(self, app, caller: Caller = Caller("main", "s1"), environment_id: int = 1) -> None:
        self.app, self.caller, self.environment_id = app, caller, environment_id
        self.record, self.scope = app.container.get(ShellRecord), app.container.get(Scope)

    def split(self, line: str, target: str) -> str:
        folder = OutputFiles(Path(target))
        parts = Chain.parts(line)
        folder.split(line, parts)
        if not Chain.is_journal_line(line):
            with self.scope.environment(self.environment_id):
                folder.numbered(self.record.start(folder.folder.name, "\n".join(p.text for p in parts if p.recorded), folder.folder, self.caller))
        return (folder.folder / "parts").read_text()

    def cap(self, line: str = "") -> str:
        cap = self.app.container.get(OutputCap).build(line)
        return f"{cap.display} {cap.characters}"

    def limit(self, line: str = "") -> str:
        with self.scope.environment(self.environment_id):
            return str(self.app.container.get(ForegroundLimit).build(line, self.caller.environment))

    def started(self, part: str, chain: str) -> None:
        with self.scope.environment(self.environment_id):
            self.record.started(chain, part, self.caller)

    def ran(self, part: str, chain: str, status: int, output: str = "", seconds: float = 0.0, changed: str = "") -> None:
        files = [ChangedFile(int(item), int(r), path) for item, r, path in (line.split("\t", 2) for line in changed.splitlines() if line.count("\t") == 2)]
        with self.scope.environment(self.environment_id):
            self.record.finish_part(chain, part, status, seconds, output, files, self.caller)

    def moved(self, chain: str, part: str, file: str) -> str:
        from journal.features.shell.feature import Shell
        with self.scope.environment(self.environment_id):
            number = self.record.moved(chain, part, Path(file), self.caller)
        return Shell.BACKGROUND_MOVE.create(n=number, file=file).rendered()

    def forget(self, chain: str, size: int) -> str:
        with self.scope.environment(self.environment_id):
            output = self.app.container.get(CommandOutputs).chain_output(chain)
            folder = OutputFiles(Path(output.folder))
            line = (folder.folder / "line").read_text() if (folder.folder / "line").is_file() else output.command
            if self.record.is_stored(chain, line, size, folder.has_cut()):
                return "kept"
            self.record.delete_output(chain, self.caller)
            return "forgotten"

    def ended(self, chain: str, status: int, file: str, last: str = "") -> None:
        with self.scope.environment(self.environment_id):
            self.record.ended(chain, status, Path(file), last, self.caller)
