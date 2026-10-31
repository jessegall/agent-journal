from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.questions.commands.answer_question import AnswerQuestion
from core.modules.questions.commands.close_question import CloseQuestion
from core.modules.questions.commands.ask_question_handler import AskQuestionHandler
from core.modules.questions.commands.ask_question_subcommand import AskQuestionSubcommand
from core.modules.questions.commands.question_list_subcommand import QuestionListSubcommand
from core.modules.questions.commands.question_show_subcommand import QuestionShowSubcommand
from core.modules.questions.support.question_marks import QUESTION_MARKS
from core.modules.questions.queries.question_query import QuestionQuery
from core.modules.questions.rules.question_answered_rule import QuestionAnsweredRule
from core.modules.questions.rules.own_question_tool_rule import OwnQuestionToolRule
from core.modules.questions.rules.question_closed_rule import QuestionClosedRule
from core.modules.questions.guards.main_agent_guard import MainAgentGuard
from core.modules.questions.guards.actor_options_guard import ActorOptionsGuard
from core.modules.questions.listeners.question_answered_mark_listener import QuestionAnsweredMarkListener
from core.modules.questions.listeners.question_open_mark_listener import QuestionOpenMarkListener
from core.modules.questions.listeners.question_closed_mark_listener import QuestionClosedMarkListener
from core.modules.questions.listeners.question_edited_mark_listener import QuestionEditedMarkListener
from core.modules.questions.migrations.m001_questions import QuestionsTablesMigration
from core.modules.questions.migrations.m002_answer_message import AnswerMessageMigration
from core.modules.questions.models.question import Question


class QuestionsModule(Module):
    """Adds questions an agent asks the user, with the options it offers and the answer it gets."""

    name = "journal.core.questions"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.messages", "journal.core.waits", "journal.core.chat"]
    models = [ModelDeclaration(Question, query=QuestionQuery, commands=(AnswerQuestion, CloseQuestion), excluded_subcommands=["make", "list", "show"])]
    migrations = [QuestionsTablesMigration, AnswerMessageMigration]
    subcommands = (AskQuestionSubcommand, QuestionListSubcommand, QuestionShowSubcommand)
    handlers = [AskQuestionHandler]
    guards = [MainAgentGuard, ActorOptionsGuard]
    driver_rules = [QuestionAnsweredRule, QuestionClosedRule, OwnQuestionToolRule]
    marks = QUESTION_MARKS
    listeners = [QuestionOpenMarkListener, QuestionEditedMarkListener, QuestionAnsweredMarkListener, QuestionClosedMarkListener]
