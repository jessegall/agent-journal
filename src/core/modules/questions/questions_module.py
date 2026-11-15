from core.modules.questions.models.declarations.question_model_declaration import QuestionModelDeclaration
from core.modules.questions.docks.questions_docks import QUESTIONS_DOCKS
from core.modules.questions.windows.questions_windows import QUESTIONS_WINDOWS
from core.modules.questions.migrations.m005_question_session import QuestionSessionMigration
from core.modules.questions.migrations.m007_question_context import QuestionContextMigration
from core.modules.questions.migrations.m006_question_environment_state_index import QuestionEnvironmentStateIndexMigration
from core.modules.questions.migrations.m003_question_agent_state_index import QuestionAgentStateIndexMigration
from core.modules.questions.support.question_nudges import QUESTION_NUDGES
from engine.module.module import Module
from core.modules.questions.commands.answer_question.answer_question_handler import AnswerQuestionHandler
from core.modules.questions.commands.ask_question.ask_question_handler import AskQuestionHandler
from core.modules.questions.commands.ask_question.ask_question_subcommand import AskQuestionSubcommand
from core.modules.questions.commands.question_list.question_list_subcommand import QuestionListSubcommand
from core.modules.questions.commands.question_show.question_show_subcommand import QuestionShowSubcommand
from core.modules.questions.marks.question_mark import QuestionMark
from core.modules.questions.marks.question_answer_mark import QuestionAnswerMark
from core.modules.questions.rules.own_question_tool_rule import OwnQuestionToolRule
from core.modules.questions.guards.question_asker_guard import QuestionAskerGuard
from core.modules.questions.guards.actor_options_guard import ActorOptionsGuard
from core.modules.questions.listeners.open_questions_dock_listener import OpenQuestionsDockListener
from core.modules.questions.listeners.question_answered_mark_listener import QuestionAnsweredMarkListener
from core.modules.questions.listeners.question_answer_line_listener import QuestionAnswerLineListener
from core.modules.questions.listeners.question_open_mark_listener import QuestionOpenMarkListener
from core.modules.questions.listeners.question_closed_mark_listener import QuestionClosedMarkListener
from core.modules.questions.listeners.question_edited_mark_listener import QuestionEditedMarkListener
from core.modules.questions.migrations.m001_questions import QuestionsTablesMigration
from core.modules.questions.migrations.m002_answer_message import AnswerMessageMigration
from core.modules.questions.migrations.m004_question_place import QuestionPlaceMigration
from core.modules.questions.seeders.questions_seeder import QuestionsSeeder
from core.modules.questions.upgrade.questions_move import QuestionsMove
from core.modules.questions.upgrade.question_links_move import QuestionLinksMove
from core.modules.questions.support.block_conditions.question_answered import QuestionAnswered
from core.modules.questions.support.block_conditions.questions_closed import QuestionsClosed
from core.modules.questions.inspectors.question_inspector import QuestionInspector


class QuestionsModule(Module):
    """Adds questions an agent asks the user, with the options it offers and the answer it gets."""

    name = "journal.core.questions"
    nudges = QUESTION_NUDGES
    requires_engine = ">=5,<6"
    block_conditions = [QuestionAnswered, QuestionsClosed]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.messages", "journal.core.waits", "journal.core.chat", "journal.core.documents", "journal.core.tasks", "journal.core.plans", "journal.core.docking"]
    models = [QuestionModelDeclaration]
    migrations = [QuestionEnvironmentStateIndexMigration, QuestionSessionMigration, QuestionAgentStateIndexMigration, QuestionsTablesMigration, AnswerMessageMigration, QuestionPlaceMigration, QuestionContextMigration]
    moves = [QuestionsMove, QuestionLinksMove]
    subcommands = [AskQuestionSubcommand, QuestionListSubcommand, QuestionShowSubcommand]
    handlers = [AskQuestionHandler, AnswerQuestionHandler]
    guards = [QuestionAskerGuard, ActorOptionsGuard]
    driver_rules = [OwnQuestionToolRule]
    marks = [QuestionMark, QuestionAnswerMark]
    listeners = [OpenQuestionsDockListener, QuestionOpenMarkListener, QuestionEditedMarkListener, QuestionAnsweredMarkListener, QuestionClosedMarkListener, QuestionAnswerLineListener]
    docks = QUESTIONS_DOCKS
    windows = QUESTIONS_WINDOWS
    inspectors = [QuestionInspector]
    seeders = [QuestionsSeeder]
