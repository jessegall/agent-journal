from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from suites.coding.modules.workers.nudges.small_batch_message import SmallBatchMessage
from suites.coding.modules.workers.support.worker_settings import WORKER_BATCH_SIZE
from engine.enums.agent_role import AgentRole
from engine.enums.command_category import CommandCategory
from engine.enums.hook_event_name import HookEventName
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.dispatch_arguments import DISPATCH_ARGUMENTS


class SmallBatchLines(EventLineSource):
    """After a worker dispatch of fewer tasks than the batch size setting, the main agent is told that giving
    a worker more work is better."""

    key = "workers.small-batch"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        shell = event.tool.shell if event.tool is not None else None
        dispatches = [part for part in shell.parts if part.classification.category is CommandCategory.JOURNAL and tuple(part.arguments[:2]) == DISPATCH_ARGUMENTS] if shell is not None else []
        counts = [self.task_count(list(part.arguments[2:])) for part in dispatches]
        batch_size = self.settings.number(WORKER_BATCH_SIZE)
        return [*(SmallBatchMessage.declared().nudge(count=count) for count in counts if count < batch_size)]

    @staticmethod
    def task_count(arguments: list[str]) -> int:
        return sum(1 for previous, argument in zip(["", *arguments], arguments) if argument.isdigit() and not previous.startswith("--"))
