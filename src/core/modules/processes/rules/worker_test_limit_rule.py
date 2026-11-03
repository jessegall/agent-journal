from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_category import CommandCategory
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.models.support.process_setting import ProcessSetting
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.processes.support.process_nudges import TEST_RUN_OVER_LIMIT
from core.modules.processes.support.process_settings import ProcessSettings
from core.modules.processes.support.reader_demands import ASKING_FLAGS


class WorkerTestLimitRule(DriverRule):
    """Refuses a worker's command when its latest counted output exceeds the test limit."""

    name = "processes.worker-test-limit-refusal"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.WORKER]

    def __init__(self, outputs: OutputQuery, settings: ProcessSettings) -> None:
        self.outputs, self.settings = outputs, settings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        limit = self.settings.integer(ProcessSetting.WORKER_TEST_LIMIT, hook.environment_id)
        tool = hook.event.tool
        if limit <= 0 or tool is None or tool.shell is None:
            return RuleAnswer.allowed()
        for part in tool.shell.parts:
            if part.classification.category is not CommandCategory.TEST_RUN or ASKING_FLAGS.intersection(part.arguments):
                continue
            outputs = self.outputs.kept().for_part(hook.environment_id, part.text).newest().page(1, 1).rows
            if outputs and outputs[0].test_count > limit:
                return RuleAnswer.refused(TEST_RUN_OVER_LIMIT.nudge(command=part.text, count=outputs[0].test_count, limit=limit))
        return RuleAnswer.allowed()
