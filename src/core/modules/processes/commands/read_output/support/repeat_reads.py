from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.driver.count_down import CountDown
from core.base.driver.times_span import TimesSpan
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.drivers.support.context_resets import ContextResets
from core.modules.drivers.support.countdowns import Countdowns
from core.modules.processes.commands.read_output.read_output import ReadOutput
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder

RUNNING_OUTPUT_READS = CountDown("processes.running_output_reads", "stop reading output", TimesSpan(3), is_silent=True)


class RepeatReads:
    """Stops an agent reading an ended run's output the same way twice in one context: what it read since its
    last compaction is still in its context, so a repeat costs a turn for nothing. The record of a read is a
    mark in the run's folder; --again reads it anyway. The third read in a row of a run still going is
    refused, since the journal tells the agent when it ends."""

    def __init__(self, queries: Queries, folder: OutputFolder, resets: ContextResets, countdowns: Countdowns) -> None:
        self.queries, self.folder, self.resets, self.countdowns = queries, folder, resets, countdowns

    def check(self, command: ReadOutput, context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return
        has_ended = self.has_ended(command.process_id)
        if not self.countdowns.tick(RUNNING_OUTPUT_READS, context.actor.id, str(command.process_id), context, until=lambda: has_ended):
            raise Refusal(f"output {command.process_id} is still running: stop polling it", f"a main agent sets a monitor with journal output monitor {command.process_id}; a helper goes idle: the journal wakes you when it ends")
        if not has_ended or command.is_repeat_allowed:
            return
        if self.folder.read_mark(command.process_id, self.mark(command, context.actor)) > self.resets.last_compaction(context.actor.id):
            raise Refusal(f"you read output {command.process_id} this way already and it is still in your context", "add --again to read it anyway")

    def note(self, command: ReadOutput, actor: Actor, read_at: str) -> None:
        if actor.type is ActorType.AGENT and self.has_ended(command.process_id):
            self.folder.write_read_mark(command.process_id, self.mark(command, actor), read_at)

    def mark(self, command: ReadOutput, actor: Actor) -> str:
        return f"{actor.id}-{command.summary}-{command.all}-{command.lines}-{command.tail}-{command.reader}"

    def has_ended(self, process_id: int) -> bool:
        return self.queries.query(Process).find(process_id).ended_at is not None
