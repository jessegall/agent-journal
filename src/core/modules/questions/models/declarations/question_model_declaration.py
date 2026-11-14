from engine.module.model_declaration import ModelDeclaration
from core.modules.questions.commands.answer_question.answer_question import AnswerQuestion
from core.modules.questions.commands.close_question.close_question import CloseQuestion
from core.modules.questions.models.question import Question
from core.modules.questions.queries.question_query import QuestionQuery


class QuestionModelDeclaration(ModelDeclaration):
    """How the module declares Question."""

    model = Question
    query = QuestionQuery
    commands = (AnswerQuestion, CloseQuestion)
    excluded_subcommands = ["make", "list", "show"]
