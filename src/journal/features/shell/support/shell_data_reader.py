from journal.repositories.reader_reports import ReaderReports
from journal.features.shell.support.ended_output import EndedOutput
from journal.features.shell.support.output_reads import OutputReads
from journal.features.shell.support.output_view import OutputView
from journal.features.shell.support.output_process_card import OutputProcessCard
from journal.features.shell.support.readers import Readers
from journal.features.shell.support.titled_run import TitledRun
from journal.features.shell.support.reader_drafts import ReaderDrafts
from journal.engine.support.lazy_facts import LazyFacts
from journal.config import Config
from journal.features.registry import Registry
from journal.models.agent import Agent
from journal.models.command_output import CommandOutput
from journal.repositories.aliases import Aliases
from journal.repositories.command_outputs import CommandOutputs
from journal.repositories.entries import Entries
from journal.repositories.environments import Environments
from journal.repositories.scope import Scope
from journal.support.stage_times import StageTimes
from journal.support.worktree import Worktree
from journal.support.moment import Moment
from journal.features.shell.shell_nudges import ShellNudges
from journal.features.tasks.tasks_nudges import TasksNudges

HISTORY_READS = 26
# how many of the agent's latest carded runs are compared for a card title they share
RECENT_RUNS = 20


class ShellDataReader:
    """Reads the shell feature's part of the feature data for an agent, each fact the first time a listener asks for it, with the fields ShellData names."""

    def __init__(self, outputs: CommandOutputs, entries: Entries, readers: Readers, card: OutputProcessCard, aliases: Aliases, config: Config, environments: Environments, scope: Scope, stages: StageTimes, reports: ReaderReports, registry: Registry, drafts: ReaderDrafts) -> None:
        self.drafts = drafts
        self.reports, self.registry = reports, registry
        self.outputs, self.entries, self.readers, self.card, self.aliases, self.config, self.environments = outputs, entries, readers, card, aliases, config, environments
        self.scope, self.stages = scope, stages

    def read(self, agent: Agent) -> LazyFacts:
        return LazyFacts("shell", {
            "background": lambda: tuple(o.row_id for o in self.outputs.background(agent.session)),
            "backgrounded_at": lambda: min((o.creation_time.timestamp() for o in self.outputs.background(agent.session)), default=0.0),
            "unannounced": lambda: tuple(EndedOutput(o.row_id, o.ending(), o.summary) for o in self.outputs.unannounced(agent.session)),
            "unread": lambda: tuple(EndedOutput(o.row_id, o.ending(), o.summary) for o in self.outputs.unread(agent.session)),
            "tool_uses": lambda: agent.tool_uses,
            "last_ending_line": lambda: self.last_ending_line(agent),
            "output_reads": lambda: self.output_reads(agent),
            "readers": lambda: tuple(self.readers.all()),
            "tipped": lambda: self.tipped(agent),
            "watch": lambda: self.watch(agent),
            "aliases": lambda: tuple(self.aliases.rows()),
            "reader_drafts": lambda: self.drafts.drafts(agent),
            "draft_count": lambda: len(self.entries.keyed_lines(agent.session, (ShellNudges.READER_DRAFT.key,))),
            "locked_readers": lambda: tuple(self.readers.locked_names()),
            "uncut_verbs": lambda: self.registry.uncut_verbs(),
            "titled_runs": lambda: self.titled_runs(agent),
            "recent_runs": lambda: self.recent_runs(agent),
            "home": lambda: str(Worktree(self.config.root, self.environments.find(agent.environment_id).name).folder),
        }, lambda: self.scope.environment(agent.environment_id), self.stages)

    def output_reads(self, agent: Agent) -> tuple[str, ...]:
        commands = [command for e in self.entries.output_tool_starts(agent.session) if (command := e.recorded_call().command)]
        return tuple([OutputReads.shape(c) for c in commands if OutputReads.is_one(c)][:HISTORY_READS])

    def tipped(self, agent: Agent) -> tuple[str, ...]:
        tips = (ShellNudges.READER_HINT, ShellNudges.ALIAS_SUGGESTION, ShellNudges.SILENT_RUN_HINT, ShellNudges.REPORT_RAISED, ShellNudges.REPORT_REFUTED, ShellNudges.FLAGGED_TITLE, ShellNudges.SHARED_TITLE)
        return tuple(self.entries.keyed_lines(agent.session, tuple(nudge.key for nudge in tips)))

    def titled_runs(self, agent: Agent) -> tuple[TitledRun, ...]:
        runs = {o.row_id: o for o in [*self.outputs.carded_runs(agent.session), *self.outputs.watched(agent.session)]}
        return tuple(self.titled(o) for o in runs.values())

    def recent_runs(self, agent: Agent) -> tuple[TitledRun, ...]:
        return tuple(self.titled(o) for o in reversed(self.outputs.recent_moves(agent.session, RECENT_RUNS)))

    def titled(self, output: CommandOutput) -> TitledRun:
        part = self.card.shown_part(output)
        return TitledRun(output.row_id, self.card.title(output, part), part, self.card.topic(output), not output.ended, self.readers.is_locked(output.watch_reader))

    def last_ending_line(self, agent: Agent) -> Moment:
        return self.entries.last_keys_moment(agent.session, (ShellNudges.OUTPUTS_ENDED.key, ShellNudges.UNREAD_OUTPUT.key, TasksNudges.WAIT_END.key)) or Moment()

    def watch(self, agent: Agent) -> OutputView:
        watched = self.outputs.watched(agent.session)
        return self.card.card_view(watched[0]) if watched else OutputView.empty()
