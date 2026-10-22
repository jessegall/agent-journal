from journal.features.shell.support.ended_output import EndedOutput
from journal.features.shell.support.output_reads import OutputReads
from journal.features.shell.support.output_view import OutputView
from journal.features.shell.support.output_views import OutputViews
from journal.features.shell.support.readers import Readers
from journal.features.shell.support.shell_data import ShellData
from journal.models.agent import Agent
from journal.repositories.aliases import Aliases
from journal.repositories.command_outputs import CommandOutputs
from journal.repositories.entries import Entries

HISTORY_READS = 26
REPEATS = 3
SHAPE_REPEATS = 5


class ShellDataReader:
    """Reads the shell feature's part of the feature data for an agent."""

    def __init__(self, outputs: CommandOutputs, entries: Entries, readers: Readers, views: OutputViews, aliases: Aliases) -> None:
        self.outputs, self.entries, self.readers, self.views, self.aliases = outputs, entries, readers, views, aliases

    def read(self, agent: Agent) -> ShellData:
        from journal.features.shell.feature import Shell
        background = self.outputs.background(agent.session)
        commands = [command for e in self.entries.output_tool_starts(agent.session) if (command := e.recorded_call().command)]
        reads = [OutputReads.shape(c) for c in commands if OutputReads.is_one(c)][:HISTORY_READS]
        tipped = [line for nudge in (Shell.READER_HINT, Shell.READER_SUGGESTION, Shell.ALIAS_SUGGESTION, Shell.NEW_READER_SUGGESTION) for line in self.entries.recent_lines(agent.session, nudge.key, 0)]
        return ShellData(
            background=tuple(o.row_id for o in background),
            backgrounded_at=min((o.creation_time.timestamp() for o in background), default=0.0),
            unannounced=tuple(EndedOutput(o.row_id, o.ending()) for o in self.outputs.unannounced(agent.session)),
            output_reads=tuple(reads),
            readers=tuple(self.readers.all()),
            tipped=tuple(tipped),
            watch=self.watch(agent),
            aliases=tuple(self.aliases.rows()),
            repeated=tuple(self.entries.repeated_commands(agent.session, REPEATS)),
            repeated_shapes=tuple(self.entries.repeated_shapes(agent.session, SHAPE_REPEATS)),
        )

    def watch(self, agent: Agent) -> OutputView:
        watched = self.outputs.watched(agent.session)
        return self.views.card_view(watched[0]) if watched else OutputView.empty()
