from journal.features.shell.support.ended_output import EndedOutput
from journal.features.shell.support.output_reads import OutputReads
from journal.features.shell.support.readers import Readers
from journal.features.shell.support.shell_data import ShellData
from journal.models.agent import Agent
from journal.repositories.command_outputs import CommandOutputs
from journal.repositories.entries import Entries

HISTORY_READS = 26


class ShellDataReader:
    """Reads the shell feature's part of the feature data for an agent."""

    def __init__(self, outputs: CommandOutputs, entries: Entries, readers: Readers) -> None:
        self.outputs, self.entries, self.readers = outputs, entries, readers

    def read(self, agent: Agent) -> ShellData:
        from journal.features.shell.feature import Shell
        background = self.outputs.background(agent.session)
        commands = [e.recorded_call().get("command", "") for e in self.entries.tool_starts(agent.session) if e.data.get("tool_name") == "Bash"]
        reads = [OutputReads.shape(c) for c in commands if OutputReads.is_one(c)][:HISTORY_READS]
        tipped = [*self.entries.recent_lines(agent.session, Shell.READER_HINT.key, 0), *self.entries.recent_lines(agent.session, Shell.READER_SUGGESTION.key, 0)]
        return ShellData(
            background=tuple(o.id for o in background),
            backgrounded_at=min((o.created_at.timestamp() for o in background), default=0.0),
            unannounced=tuple(EndedOutput(o.id, o.status) for o in self.outputs.unannounced(agent.session)),
            output_reads=tuple(reads),
            readers=tuple(self.readers.all()),
            tipped=tuple(tipped),
        )
