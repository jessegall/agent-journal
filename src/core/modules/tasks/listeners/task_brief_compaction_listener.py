from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.actor_type import ActorType
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from core.modules.drivers.events.agent_compacted import AgentCompacted
from core.modules.tasks.commands.reset_task_reads.reset_task_reads import ResetTaskReads
from core.modules.tasks.support.task_brief_blocks import TaskBriefBlocks


class TaskBriefCompactionListener(CommitListener[AgentCompacted]):
    """When an agent's context window is compacted, the briefs it read are in its text no more: it reads again
    the task it works on, and an earlier one when it goes back to that. It runs once the compaction's hook is
    committed, so the step of that hook has closed the holds the old reads satisfied."""

    name = "tasks.brief-compaction"

    def __init__(self, bus: Bus, blocks: TaskBriefBlocks) -> None:
        self.bus, self.blocks = bus, blocks

    def handle(self, event: AgentCompacted, logged: LoggedEvent) -> None:
        call = event.row
        actor = Actor(call.session_agent_id, ActorType.AGENT)
        self.bus.run(ResetTaskReads(call.session_agent_id), actor, cause_id=logged.id, environment_id=call.environment_id)
        block_plan = self.blocks.current_block(call.session_agent_id)
        if block_plan is not None:
            self.bus.run(block_plan, actor, cause_id=logged.id, environment_id=call.environment_id)
