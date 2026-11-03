from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.support.test_listings import TestListings
from core.modules.processes.support.process_nudges import TEST_LIMIT_REFUSAL
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.reader_demands import ASKING_FLAGS


class WorkerTestCountRule(DriverRule):
    """Refuses a worker's command when its latest counted output exceeds the test limit."""

    name = "processes.worker-test-limit-refusal"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.WORKER]

    def __init__(self, listings: TestListings, settings: ProcessSettings) -> None:
        self.listings, self.settings = listings, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        limit = self.settings.integer(ProcessSetting.WORKER_TEST_LIMIT, hook.environment_id)
        tool = hook.event.tool
        if limit <= 0 or tool is None or tool.shell is None:
            return RuleAnswer.allowed()
        for part in tool.shell.parts:
            if part.classification.category is not CommandCategory.TEST_RUN or ASKING_FLAGS.intersection(part.arguments):
                continue
            count = self.listings.previous_count(hook.environment_id, part.text)
            if count > limit:
                return RuleAnswer.refused(TEST_LIMIT_REFUSAL.nudge(command=part.text, count=count, limit=limit))
        return RuleAnswer.allowed()
