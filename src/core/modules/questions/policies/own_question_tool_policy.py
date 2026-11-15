from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from core.modules.questions.nudges.question_tool_nudge import QuestionToolNudge
from engine.enums.agent_role import AgentRole
from engine.enums.tool_type import ToolType


class OwnQuestionToolPolicy(EventPolicy):
    """An agent that calls its program's own tool for asking the user is refused, and told to ask through the
    journal."""

    key = "questions.own-tool"
    rank = "questions.policies"
    agent_types = [AgentRole.MAIN.value]

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        tool = event.tool
        if tool is None or tool.category is not ToolType.QUESTION:
            return None
        return QuestionToolNudge.declared().nudge()

