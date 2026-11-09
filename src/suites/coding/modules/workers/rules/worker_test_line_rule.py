from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.support.background_commands import BackgroundCommands
from core.modules.processes.support.reader_demands import ASKING_FLAGS
from suites.coding.modules.workers.support.worker_nudges import WORKER_NO_TEST_COMMANDS, WORKER_TEST_LINE_REFUSED
from suites.coding.modules.workers.support.worker_test_names import WorkerTestNames
from suites.coding.modules.workers.support.worker_test_names import WorkerTestNames
from suites.coding.support.coding_helper_role import CodingHelperRole


class WorkerTestLineRule(DriverRule):
    """A worker runs a test only through its named test commands; any other test line is refused."""

    name = "workers.named-tests-only"
    priority = -3
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [CodingHelperRole.WORKER]
    refuses_one_action = "A worker runs a test only through its named test commands"

    def __init__(self, commands: BackgroundCommands, names: WorkerTestNames) -> None:
        self.commands, self.names = commands, names

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.shell is None:
            return RuleAnswer.allowed()
        for part in tool.shell.parts:
            if self.commands.part_command(part, tool.shell).category is CommandCategory.TEST_RUN and not WorkerTestNames.is_worker_test(part) and not ASKING_FLAGS.intersection(part.arguments):
                return RuleAnswer.refused(self.refusal(hook.agent_id))
        return RuleAnswer.allowed()

    def refusal(self, worker_id: int) -> Nudge:
        names = self.names.names_text(worker_id)
        return WORKER_TEST_LINE_REFUSED.nudge(names=names) if names else WORKER_NO_TEST_COMMANDS.nudge(worker=worker_id)
