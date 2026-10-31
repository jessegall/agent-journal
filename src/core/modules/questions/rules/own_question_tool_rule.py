from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool_type import ToolType


class OwnQuestionToolRule(DriverRule):
    """An agent that calls its program's own tool for asking the user is refused, and told to ask through the
    journal."""

    name = "questions.own-tool"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.category is not ToolType.QUESTION:
            return RuleAnswer.allowed()
        return RuleAnswer.refused('ask with journal question ask "<one line>" --options "a" "b", not your own question tool')
