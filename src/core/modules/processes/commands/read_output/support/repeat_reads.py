from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.drivers.support.context_resets import ContextResets
from core.modules.processes.commands.read_output.read_output import ReadOutput
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder

POLL_LIMIT_COUNT = 3


class RepeatReads:
    """Stops an agent reading an ended run's output the same way twice in one context: what it read since its
    last compaction is still in its context, so a repeat costs a turn for nothing. The record of a read is a
    mark in the run's folder; --again reads it anyway. The third read in a row of a run still going is
    refused, since the journal tells the agent when it ends."""

    def __init__(self, queries: Queries, folder: OutputFolder, resets: ContextResets) -> None:
        self.queries, self.folder, self.resets = queries, folder, resets
        self.running_reads: dict[int, tuple[int, int]] = {}

    def check(self, command: ReadOutput, actor: Actor) -> None:
        if actor.type is not ActorType.AGENT:
            return
        if not self.has_ended(command.process_id):
            self.count_running_read(command.process_id, actor.id)
            return
        self.running_reads.pop(actor.id, None)
        if command.is_repeat_allowed:
            return
        if self.folder.read_mark(command.process_id, self.mark(command, actor)) > self.resets.last_compaction(actor.id):
            raise Refusal(f"you read output {command.process_id} this way already and it is still in your context", "add --again to read it anyway")

    def count_running_read(self, process_id: int, agent_id: int) -> None:
        previous_id, previous_reads = self.running_reads.get(agent_id, (process_id, 0))
        reads = previous_reads + 1 if previous_id == process_id else 1
        self.running_reads[agent_id] = (process_id, reads)
        if reads >= POLL_LIMIT_COUNT:
            raise Refusal(f"output {process_id} is still running: stop polling it", f"a main agent sets a monitor with journal output monitor {process_id}; a helper goes idle: the journal wakes you when it ends")

    def note(self, command: ReadOutput, actor: Actor, read_at: str) -> None:
        if actor.type is ActorType.AGENT and self.has_ended(command.process_id):
            self.folder.write_read_mark(command.process_id, self.mark(command, actor), read_at)

    def mark(self, command: ReadOutput, actor: Actor) -> str:
        return f"{actor.id}-{command.summary}-{command.all}-{command.lines}-{command.tail}-{command.reader}"

    def has_ended(self, process_id: int) -> bool:
        return self.queries.query(Process).find(process_id).ended_at is not None
