from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision

QUESTION_TOOLS = frozenset({"AskUserQuestion", "request_user_input"})


class RefuseQuestionTool(AgentListener[ToolStarting]):
    """A question asked through the provider's own tool never reaches the viewer; it is refused and asked through the journal instead."""

    blocking = True

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.questions.feature import Questions
        return Decision.refuse(Questions.OWN_TOOL.about().rendered()) if event.tool in QUESTION_TOOLS else None
