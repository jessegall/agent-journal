from core.base.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.drivers.models.hook_call import HookCall
from core.modules.tasks.commands.reset_task_reads.reset_task_reads import ResetTaskReads
from core.modules.tasks.support.task_brief_blocks import TaskBriefBlocks
from core.base.change.created import Created
from core.base.command.context import Context


class TaskBriefCompactionListener(SaveListener[Created[HookCall]]):
    """When an agent's context window is compacted, the briefs it read are in its text no more: it reads again
    the task it works on, and an earlier one when it goes back to that."""

    name = "tasks.brief-compaction"

    def __init__(self, bus: Bus, blocks: TaskBriefBlocks) -> None:
        self.bus, self.blocks = bus, blocks

    def handle(self, event: Created[HookCall], context: Context) -> None:
        call = event.row
        if not isinstance(call, HookCall) or not call.is_compaction:
            return
        self.bus.dispatch(ResetTaskReads(call.agent_id), context)
        self.blocks.block_current(call.agent_id, context)
