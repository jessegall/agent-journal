from core.base.change.change import Change
from core.base.command.bus import Bus
from core.base.driver.hook_event_name import HookEventName
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.drivers.models.hook_call import HookCall
from core.modules.tasks.commands.reset_task_reads.reset_task_reads import ResetTaskReads
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.support.task_brief_blocks import TaskBriefBlocks


class TaskBriefCompactionListener(SaveListener):
    """When an agent's context window is compacted, the briefs it read are in its text no more: it reads again
    the tasks it holds."""

    name = "tasks.brief-compaction"
    event = "hook_call.create"

    def __init__(self, bus: Bus, tasks: TaskQuery, blocks: TaskBriefBlocks) -> None:
        self.bus, self.tasks, self.blocks = bus, tasks, blocks

    def handle(self, change: Change[Model]) -> None:
        call = change.new_row
        if not isinstance(call, HookCall) or call.hook != HookEventName.COMPACT:
            return
        self.bus.dispatch(ResetTaskReads(call.agent_id), change.context)
        for task in tuple(self.tasks.holder(call.agent_id).started().all_rows()):
            self.blocks.block_unread(call.agent_id, task, change.context)
