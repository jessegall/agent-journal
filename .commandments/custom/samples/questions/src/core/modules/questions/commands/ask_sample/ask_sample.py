from core.modules.questions.models.question import Question
from core.modules.questions.models.lifecycles.question_lifecycle import QuestionLifecycle
from core.modules.waits.models.wait import Wait


# @sin architecture_layout_helper_in_a_kind_folder
class AskSample:
    def handle(self, repository, question, context):
        # @sin architecture_questions_question_made_outside_the_ask_handler
        repository.save(Question(creator_id=1, text="Which?"), context)
        # @sin architecture_questions_question_answered_outside_its_commands
        repository.save(question.moved(QuestionLifecycle.answer, answer="sqlite"), context)
        # @sin architecture_questions_question_answered_outside_its_commands
        repository.save(question.changed(state=QuestionState.CLOSED), context)
        # @sin architecture_questions_wait_written_by_questions
        repository.save(Wait(creator_id=1, focus="x"), context)
        # @righteous architecture_questions_question_answered_outside_its_commands
        return question.changed(text="Which database?")
