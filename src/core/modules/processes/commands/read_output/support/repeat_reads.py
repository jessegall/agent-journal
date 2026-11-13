from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.context import Context
from engine.query.queries import Queries
from engine.enums.agent_role import AgentRole
from engine.errors.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.drivers.support.context_resets import ContextResets
from core.modules.processes.commands.read_output.read_output import ReadOutput
from core.modules.processes.models.process import Process
from core.modules.processes.support.cadence.run_silences import CHECKED_MARK
from core.modules.processes.support.held_runs import HeldRuns
from core.modules.processes.support.output_folder import OutputFolder

MAIN_POLL_ADVICE = "set a monitor with journal output monitor {process}"
HELPER_POLL_ADVICE = "go idle: the journal wakes you when it ends"


class RepeatReads:
    """Stops an agent reading an ended run's output the same way twice in one context: what it read since its
    last compaction is still in its context, so a repeat costs a turn for nothing. The record of a read is a
    mark in the run's folder; --again reads it anyway. A run still going is read once by an agent: every
    later read of it by that agent is refused, in any form and whatever it did between, until the run ends,
    since the journal tells the agent when it ends, or until the run is held for printing nothing, which asks
    for a read."""

    def __init__(self, queries: Queries, folder: OutputFolder, resets: ContextResets, blocked_runs: HeldRuns) -> None:
        self.queries, self.folder, self.resets, self.held_runs = queries, folder, resets, blocked_runs

    def check(self, command: ReadOutput, context: Context) -> None:
        if context.actor.type is not ActorType.AGENT:
            return
        if not self.has_ended(command.process_id):
            if self.folder.read_mark(command.process_id, self.running_mark(context.actor)) and not self.is_held(command.process_id, context):
                raise Refusal(f"output {command.process_id} is still running and you read it already: stop polling it", self.poll_advice(context.actor).format(process=command.process_id))
            return
        if command.is_repeat_allowed:
            return
        if self.folder.read_mark(command.process_id, self.mark(command, context.actor)) > self.resets.last_compaction(context.actor.id):
            raise Refusal(f"you read output {command.process_id} this way already and it is still in your context", "add --again to read it anyway")

    def note(self, command: ReadOutput, actor: Actor, read_at: str) -> None:
        if actor.type is not ActorType.AGENT:
            return
        if self.has_ended(command.process_id):
            self.folder.write_read_mark(command.process_id, self.mark(command, actor), read_at)
        else:
            self.folder.write_read_mark(command.process_id, self.running_mark(actor), read_at)
            self.folder.write_read_mark(command.process_id, CHECKED_MARK, read_at)

    def poll_advice(self, actor: Actor) -> str:
        if self.queries.query(Agent).find(actor.id).role == AgentRole.MAIN:
            return MAIN_POLL_ADVICE
        return HELPER_POLL_ADVICE

    def is_held(self, process_id: int, context: Context) -> bool:
        blocked_run = self.held_runs.found(context.actor.id, context.timestamp)
        return blocked_run is not None and blocked_run.process.id == process_id

    @staticmethod
    def running_mark(actor: Actor) -> str:
        return f"{actor.id}-running"

    def mark(self, command: ReadOutput, actor: Actor) -> str:
        return f"{actor.id}-{command.summary}-{command.all}-{command.lines}-{command.tail}-{command.reader}"

    def has_ended(self, process_id: int) -> bool:
        return self.queries.query(Process).find(process_id).ended_at is not None
