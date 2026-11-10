from core.modules.questions.support.question_nudges import QUESTION_TOOL
from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.driver.tool_type import ToolType


class OwnQuestionToolRule(DriverRule):
    """An agent that calls its program's own tool for asking the user is refused, and told to ask through the
    journal."""

    name = "questions.own-tool"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    refuses_one_action = "An agent that calls its program's own tool for asking the user is refused, and told to ask through the journal"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.category is not ToolType.QUESTION:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(QUESTION_TOOL.nudge())
