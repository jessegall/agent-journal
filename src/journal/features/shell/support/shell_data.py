from dataclasses import dataclass

from journal.features.shell.support.ended_output import EndedOutput
from journal.features.shell.support.output_view import OutputView
from journal.features.shell.support.reader import Reader
from journal.features.shell.support.script_reader import ScriptReader


@dataclass(frozen=True)
class ShellData:
    """The shell feature's reading: the agent's commands running in the background and since when, those that ended there untold, the shapes of its last reads of outputs by hand, the project's readers, the reader tips already said, and what the agent's watched output shows."""

    background: tuple[int, ...]
    backgrounded_at: float
    unannounced: tuple[EndedOutput, ...]
    output_reads: tuple[str, ...]
    readers: tuple[Reader | ScriptReader, ...]
    tipped: tuple[str, ...]
    watch: OutputView
