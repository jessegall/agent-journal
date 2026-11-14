from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.driver.agent_hook import AgentHook
from engine.enums.command_category import CommandCategory
from engine.driver.driver_rule import DriverRule
from engine.enums.rule_priority import RulePriority
from engine.enums.hook_event_name import HookEventName
from engine.driver.nudge import Nudge
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.support.background_commands import BackgroundCommands
from core.modules.processes.support.reader_demands import ASKING_FLAGS
from suites.coding.modules.workers.support.worker_nudges import WORKER_TEST_COMMANDS_MISSING, WORKER_TEST_LINE_REFUSED
from suites.coding.modules.workers.support.worker_test_names import WorkerTestNames
from suites.coding.modules.workers.support.worker_test_names import WorkerTestNames
from suites.coding.models.enums.coding_helper_role import CodingHelperRole


class WorkerTestLineRule(DriverRule):
    """A worker runs a test only through its named test commands; any other test line is refused."""

    name = "workers.named-tests-only"
    priority = RulePriority.COMMAND_CATEGORY_CHECK
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [CodingHelperRole.WORKER]
    single_action_refusal = "A worker runs a test only through its named test commands"

    def __init__(self, commands: BackgroundCommands, names: WorkerTestNames, numbers: RowNumbers) -> None:
        self.numbers = numbers
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
        return WORKER_TEST_LINE_REFUSED.nudge(names=names) if names else WORKER_TEST_COMMANDS_MISSING.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worker_id))
