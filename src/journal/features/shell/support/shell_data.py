from dataclasses import dataclass

from journal.features.shell.support.ended_output import EndedOutput
from journal.features.shell.support.output_view import OutputView
from journal.features.shell.support.reader import Reader
from journal.features.shell.support.script_reader import ScriptReader
from journal.models.alias import Alias
from journal.support.moment import Moment


@dataclass(frozen=True)
class ShellData:
    """The shell feature's reading: the agent's commands running in the background and since when, those that ended there untold, the readers asked to read better since each was last written, one name per ask, those told but not yet read with the agent's tool uses now and when it was last told of an ending, the shapes of its last reads of outputs by hand, the project's readers, the reader and alias tips already said, what the agent's watched output shows, and the project's aliases."""

    background: tuple[int, ...]
    backgrounded_at: float
    unannounced: tuple[EndedOutput, ...]
    unread: tuple[EndedOutput, ...]
    reader_requests: tuple[str, ...]
    tool_uses: int
    last_ending_line: Moment
    output_reads: tuple[str, ...]
    readers: tuple[Reader | ScriptReader, ...]
    tipped: tuple[str, ...]
    watch: OutputView
    aliases: tuple[Alias, ...]
