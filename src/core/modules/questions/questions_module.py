from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.questions.commands.answer_question import AnswerQuestion
from core.modules.questions.commands.close_question import CloseQuestion
from core.modules.questions.commands.ask_question_handler import AskQuestionHandler
from core.modules.questions.commands.ask_question_subcommand import AskQuestionSubcommand
from core.modules.questions.commands.question_list_subcommand import QuestionListSubcommand
from core.modules.questions.commands.question_show_subcommand import QuestionShowSubcommand
from core.modules.questions.queries.question_query import QuestionQuery
from core.modules.questions.guards.asked_by_the_main_agent_guard import AskedByTheMainAgentGuard
from core.modules.questions.guards.options_name_the_actor_guard import OptionsNameTheActorGuard
from core.modules.questions.migrations.m001_questions import QuestionsTablesMigration
from core.modules.questions.models.question import Question


class QuestionsModule(Module):
    """Adds questions an agent asks the user, with the options it offers and the answer it gets."""

    name = "journal.core.questions"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]
    models = (ModelDeclaration(Question, query=QuestionQuery, commands=(AnswerQuestion, CloseQuestion), excluded_subcommands=["make", "list", "show"]),)
    migrations = [QuestionsTablesMigration]
    subcommands = (AskQuestionSubcommand, QuestionListSubcommand, QuestionShowSubcommand)
    handlers = [AskQuestionHandler]
    guards = [AskedByTheMainAgentGuard, OptionsNameTheActorGuard]
