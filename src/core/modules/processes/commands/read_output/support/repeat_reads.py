from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.hook_event_name import HookEventName
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.drivers.models.hook_call import HookCall
from core.modules.processes.commands.read_output.read_output import ReadOutput
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder


class RepeatReads:
    """Stops an agent reading an ended run's output the same way twice in one context: what it read since its
    last compaction is still in its context, so a repeat costs a turn for nothing. The record of a read is a
    mark in the run's folder; --again reads it anyway."""

    def __init__(self, queries: Queries, folder: OutputFolder) -> None:
        self.queries, self.folder = queries, folder

    def check(self, command: ReadOutput, actor: Actor) -> None:
        if actor.type is not ActorType.AGENT or command.is_repeat_allowed or not self.has_ended(command.process_id):
            return
        if self.folder.read_mark(command.process_id, self.mark(command, actor)) > self.last_compaction(actor.id):
            raise Refusal(f"you read output {command.process_id} this way already and it is still in your context", "add --again to read it anyway")

    def note(self, command: ReadOutput, actor: Actor, read_at: str) -> None:
        if actor.type is ActorType.AGENT and self.has_ended(command.process_id):
            self.folder.write_read_mark(command.process_id, self.mark(command, actor), read_at)

    def mark(self, command: ReadOutput, actor: Actor) -> str:
        return f"{actor.id}-{command.summary}-{command.all}-{command.lines}-{command.tail}-{command.reader}"

    def has_ended(self, process_id: int) -> bool:
        return self.queries.query(Process).find(process_id).ended_at is not None

    def last_compaction(self, agent_id: int) -> str:
        call = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.COMPACT).descending("id").first()
        return call.created_at.text if call is not None and call.created_at is not None else ""
