from core.modules.questions.models.question import Question
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle
from core.modules.waits.models.wait import Wait


# @sin architecture_layout_KindFoldersHoldTheirKindDetector
class AskSample:
    def handle(self, repository, question, context):
        # @sin architecture_questions_QuestionsAskedByCommandDetector
        repository.save(Question(environment_id=1, agent_id=1, creator_id=1, text="Which?"), context)
        # @sin architecture_questions_AnswerOnlyByCommandDetector
        repository.save(question.moved(QuestionLifecycle.answer, answer="sqlite"), context)
        # @sin architecture_questions_AnswerOnlyByCommandDetector
        repository.save(question.changed(state=QuestionState.CLOSED), context)
        # @sin architecture_questions_WaitsOnlyByWaitsCommandsDetector
        repository.save(Wait(agent_id=1, creator_id=1, focus="x"), context)
        # @righteous architecture_questions_AnswerOnlyByCommandDetector
        return question.changed(text="Which database?")
