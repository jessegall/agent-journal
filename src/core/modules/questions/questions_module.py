from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.questions.commands.answer_question import AnswerQuestion
from core.modules.questions.commands.close_question import CloseQuestion
from core.modules.questions.commands.ask_question_handler import AskQuestionHandler
from core.modules.questions.commands.ask_question_subcommand import AskQuestionSubcommand
from core.modules.questions.commands.question_list_subcommand import QuestionListSubcommand
from core.modules.questions.commands.question_show_subcommand import QuestionShowSubcommand
from core.modules.questions.support.question_marks import QUESTION_DOCKS, QUESTION_MARKS
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
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.questions.migrations.m001_questions import QuestionsTablesMigration
from core.modules.questions.migrations.m002_answer_message import AnswerMessageMigration
from core.modules.questions.models.question import Question
from core.modules.questions.seeders.questions_seeder import QuestionsSeeder
from core.modules.questions.upgrade.questions_move import QuestionsMove


class QuestionsModule(Module):
    """Adds questions an agent asks the user, with the options it offers and the answer it gets."""

    name = "journal.core.questions"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.messages", "journal.core.waits", "journal.core.chat"]
    models = [ModelDeclaration(Question, query=QuestionQuery, commands=(AnswerQuestion, CloseQuestion), excluded_subcommands=["make", "list", "show"])]
    migrations = [QuestionsTablesMigration, AnswerMessageMigration]
    moves = [QuestionsMove]
    subcommands = (AskQuestionSubcommand, QuestionListSubcommand, QuestionShowSubcommand)
    handlers = [AskQuestionHandler]
    guards = [MainAgentGuard, ActorOptionsGuard]
    driver_rules = [QuestionAnsweredRule, QuestionClosedRule, OwnQuestionToolRule]
    marks = QUESTION_MARKS
    listeners = [QuestionOpenMarkListener, QuestionEditedMarkListener, QuestionAnsweredMarkListener, QuestionClosedMarkListener]
    docks = QUESTION_DOCKS
    windows = [WindowDeclaration("questions.questions", "Questions", "questions.js", WindowLoading.COMPONENT, icon=WindowIcon.QUESTION,
                                 reads=["question list", "question show"], runs=["question answer", "question close"], events=["question.*"]),
               WindowDeclaration("questions.waiting", "Waiting", "waiting.js", WindowLoading.COMPONENT, icon=WindowIcon.HALT,
                                 reads=["wait list", "wait-target list", "question list"], events=["wait.*", "wait_target.*", "question.*"])]
    seeders = [QuestionsSeeder]
