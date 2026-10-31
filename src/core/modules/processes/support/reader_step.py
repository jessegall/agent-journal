from dataclasses import dataclass

from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.modules.processes.queries.reader_query import ReaderQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.reader_run import ReaderRun

NEWLINE = b"\n"


@dataclass(frozen=True)
class ReaderAdvance:
    """What the reader made of the bytes that arrived since it last looked: its new lines, how far it has read, and the
    summary and progress it found; a script reader's lines replace what the file held."""

    lines: list[str]
    read_offset: int
    read_lines: int
    summary: str
    progress: int
    replaces: bool = False


class ReaderStep:
    """Passes the bytes of an output that arrived since the reader last looked through the reader the output keeps; a
    script reader needs the whole text, so it runs once, when the output ends."""

    def __init__(self, folder: OutputFolder, readers: ReaderQuery, run: ReaderRun) -> None:
        self.folder, self.readers, self.run = folder, readers, run

    def advance(self, process: Process, output: Output, is_final: bool) -> ReaderAdvance | None:
        if output.reader_id is None:
            return None
        reader = self.readers.find(output.reader_id)
        if reader.type is ReaderType.SCRIPT:
            return self.script_advance(process, output, is_final)
        raw = self.folder.bytes_from(process.id, output.read_offset)
        chunk = raw if is_final else raw[: raw.rfind(NEWLINE) + 1]
        if not chunk:
            return None
        text = chunk.decode(errors="replace")
        counted = text.count("\n") + (0 if text.endswith("\n") else 1)
        return ReaderAdvance(self.run.lines(reader, text, process.state.value, output.read_lines + 1), output.read_offset + len(chunk), output.read_lines + counted,
                             self.run.summary(reader, text) or output.reader_summary, self.run.progress(reader, text, output.progress))

    def script_advance(self, process: Process, output: Output, is_final: bool) -> ReaderAdvance | None:
        if not is_final:
            return None
        reader = self.readers.find(output.reader_id or 0)
        text = self.folder.all_output(process.id)
        return ReaderAdvance(self.run.lines(reader, text, process.state.value), len(text.encode()), text.count("\n"), self.run.summary(reader, text), output.progress, replaces=True)
