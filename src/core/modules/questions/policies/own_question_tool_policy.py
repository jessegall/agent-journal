from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from core.modules.questions.agent_messages.question_tool_message import QuestionToolMessage
from engine.enums.agent_role import AgentRole
from engine.enums.tool_type import ToolType


class OwnQuestionToolPolicy(EventPolicy):
    """An agent that calls its program's own tool for asking the user is refused, and told to ask through the
    journal."""

    key = "questions.own-tool"
    rank = "questions.policies"
    agent_types = [AgentRole.MAIN.value]

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        tool = event.tool
        if tool is None or tool.category is not ToolType.QUESTION:
            return None
        return QuestionToolMessage.declared().agent_message()

