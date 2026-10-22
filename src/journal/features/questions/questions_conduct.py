from journal.engine.conduct import Conduct
from journal.engine.support.settings import Settings
from journal.engine.support.transition import Transition
from journal.events.agent.tool_starting import ToolStarting
from journal.events.rows.question_posed import QuestionPosed
from journal.support.user_question import UserQuestion


class QuestionsConduct(Conduct):
    """The questions feature's conduct in every state: a question asked through the journal pushes Waiting on whatever the agent was doing, and one asked through the provider's own tool never reaches the viewer, so it is held and asked through the journal instead."""

    def on_question_posed(self, event: QuestionPosed, settings: Settings) -> Transition:
        from journal.features.questions.states.waiting import Waiting
        return self.push(Waiting(question_id=event.question_id))

    def on_tool_starting(self, event: ToolStarting, settings: Settings) -> Transition:
        from journal.features.questions.feature import Questions
        return self.refuse(Questions.JOURNAL_QUESTION_TOOL.create()) if isinstance(event.call.operation, UserQuestion) else self.none()
