from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting

QUESTION_TOOLS = frozenset({"AskUserQuestion", "request_user_input"})


class QuestionsConduct(Conduct):
    """The questions feature's conduct in every state: a question asked through the provider's own tool never reaches the viewer, so it is held and asked through the journal instead."""

    def on_tool_starting_questions(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.questions.feature import Questions
        return self.hold(Questions.ASK_THROUGH_THE_JOURNAL.create()) if event.tool in QUESTION_TOOLS else self.unchanged()
