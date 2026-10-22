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
from journal.support.moment import Moment

HISTORY_READS = 26


class ShellDataReader:
    """Reads the shell feature's part of the feature data for an agent."""

    def __init__(self, outputs: CommandOutputs, entries: Entries, readers: Readers, views: OutputViews, aliases: Aliases) -> None:
        self.outputs, self.entries, self.readers, self.views, self.aliases = outputs, entries, readers, views, aliases

    def read(self, agent: Agent) -> ShellData:
        from journal.features.shell.feature import Shell
        background = self.outputs.background(agent.session)
        commands = [command for e in self.entries.output_tool_starts(agent.session) if (command := e.recorded_call().command)]
        reads = [OutputReads.shape(c) for c in commands if OutputReads.is_one(c)][:HISTORY_READS]
        tipped = [line for nudge in (Shell.READER_HINT, Shell.READER_SUGGESTION, Shell.ALIAS_SUGGESTION, Shell.NEW_READER_SUGGESTION, Shell.READER_FIX, Shell.READER_DETAIL) for line in self.entries.recent_lines(agent.session, nudge.key, 0)]
        return ShellData(
            background=tuple(o.row_id for o in background),
            backgrounded_at=min((o.creation_time.timestamp() for o in background), default=0.0),
            unannounced=tuple(EndedOutput(o.row_id, o.ending()) for o in self.outputs.unannounced(agent.session)),
            unread=tuple(EndedOutput(o.row_id, o.ending()) for o in self.outputs.unread(agent.session)),
            tool_uses=agent.tool_uses,
            last_ending_line=self.last_ending_line(agent),
            output_reads=tuple(reads),
            readers=tuple(self.readers.all()),
            tipped=tuple(tipped),
            watch=self.watch(agent),
            aliases=tuple(self.aliases.rows()),
        )

    def last_ending_line(self, agent: Agent) -> Moment:
        from journal.features.shell.feature import Shell
        from journal.features.tasks.feature import Tasks
        entry = self.entries.last_line_entry(agent.session, (Shell.OUTPUTS_ENDED.key, Shell.UNREAD_OUTPUT.key, Tasks.WAIT_END.key))
        return Moment(seconds=entry.data["time"], tool_uses=entry.data["tool_use"]) if entry else Moment()

    def watch(self, agent: Agent) -> OutputView:
        watched = self.outputs.watched(agent.session)
        return self.views.card_view(watched[0]) if watched else OutputView.empty()
