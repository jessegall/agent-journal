from suites.coding.modules.workers.support.worker_nudges import SMALL_BATCH
from suites.coding.modules.workers.support.worker_settings import WORKER_BATCH_SIZE
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.support.dispatch_arguments import DISPATCH_ARGUMENTS


class SmallBatchRule(DriverRule):
    """After a worker dispatch of fewer tasks than the batch size setting, the main agent is told that giving
    a worker more work is better."""

    name = "workers.small-batch"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        dispatches = [part for part in shell.parts if part.classification.category is CommandCategory.JOURNAL and tuple(part.arguments[:2]) == DISPATCH_ARGUMENTS] if shell is not None else []
        counts = [self.task_count(list(part.arguments[2:])) for part in dispatches]
        batch_size = self.settings.number(WORKER_BATCH_SIZE)
        return RuleAnswer.with_nudges(*(SMALL_BATCH.nudge(count=count) for count in counts if count < batch_size))

    @staticmethod
    def task_count(arguments: list[str]) -> int:
        return sum(1 for previous, argument in zip(["", *arguments], arguments) if argument.isdigit() and not previous.startswith("--"))
