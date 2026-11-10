from suites.coding.support.coding_helper_role import CodingHelperRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from suites.coding.modules.workers.bindings.worker_test_listings import WorkerTestListings
from suites.coding.modules.workers.support.test_limit_nudges import TEST_LIMIT_REFUSAL
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.support.coding_settings import WORKER_TEST_LIMIT
from core.modules.processes.support.reader_demands import ASKING_FLAGS


class WorkerTestCountRule(DriverRule):
    """Refuses a worker's command when its latest counted output exceeds the test limit."""

    name = "processes.worker-test-limit-refusal"
    priority = -1
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [CodingHelperRole.WORKER]
    refuses_one_action = "Refuses a worker's command when its latest counted output exceeds the test limit"

    def __init__(self, listings: WorkerTestListings, settings: SettingValues) -> None:
        self.listings, self.settings = listings, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        limit = self.settings.number(WORKER_TEST_LIMIT)
        tool = hook.event.tool
        if limit <= 0 or tool is None or tool.shell is None:
            return RuleAnswer.allowed()
        test_lines = dict.fromkeys(part.text for part in tool.shell.parts
                                   if part.classification.category is CommandCategory.TEST_RUN and not ASKING_FLAGS.intersection(part.arguments))
        for line in test_lines:
            count = self.listings.previous_count(line)
            if count > limit:
                return RuleAnswer.refused(TEST_LIMIT_REFUSAL.nudge(count=count, limit=limit))
        return RuleAnswer.allowed()
