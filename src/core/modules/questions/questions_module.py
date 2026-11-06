from core.modules.questions.migrations.m005_question_session import QuestionSessionMigration
from core.modules.questions.migrations.m007_question_context import QuestionContextMigration
from core.modules.questions.migrations.m006_question_environment_state_index import QuestionEnvironmentStateIndexMigration
from core.modules.questions.migrations.m003_question_agent_state_index import QuestionAgentStateIndexMigration
from core.modules.questions.support.question_nudges import QUESTION_NUDGES
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.questions.commands.answer_question.answer_question import AnswerQuestion
from core.modules.questions.commands.answer_question.answer_question_handler import AnswerQuestionHandler
from core.modules.questions.commands.close_question.close_question import CloseQuestion
from core.modules.questions.commands.ask_question.ask_question_handler import AskQuestionHandler
from core.modules.questions.commands.ask_question.ask_question_subcommand import AskQuestionSubcommand
from core.modules.questions.commands.question_list.question_list_subcommand import QuestionListSubcommand
from core.modules.questions.commands.question_show.question_show_subcommand import QuestionShowSubcommand
from core.modules.questions.support.question_marks import QUESTION_DOCKS, QUESTION_MARKS
from core.modules.questions.queries.question_query import QuestionQuery
from core.modules.questions.rules.question_answered_rule import QuestionAnsweredRule
from core.modules.questions.rules.own_question_tool_rule import OwnQuestionToolRule
from core.modules.questions.rules.question_closed_rule import QuestionClosedRule
from core.modules.questions.guards.main_agent_guard import MainAgentGuard
from core.modules.questions.guards.actor_options_guard import ActorOptionsGuard
from core.modules.questions.listeners.open_questions_dock_listener import OpenQuestionsDockListener
from core.modules.questions.listeners.question_answered_mark_listener import QuestionAnsweredMarkListener
from core.modules.questions.listeners.question_open_mark_listener import QuestionOpenMarkListener
from core.modules.questions.listeners.question_closed_mark_listener import QuestionClosedMarkListener
from core.modules.questions.listeners.question_edited_mark_listener import QuestionEditedMarkListener
from core.base.viewer.window_declaration import WindowDeclaration
from core.base.viewer.window_key import WindowKey
from core.base.viewer.key_loading import KeyLoading
from core.base.viewer.window_search import WindowSearch
from core.modules.questions.support.question_searcher import QuestionSearcher
from core.base.viewer.window_place import WindowPlace
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.window_loading import WindowLoading
from core.modules.questions.migrations.m001_questions import QuestionsTablesMigration
from core.modules.questions.migrations.m002_answer_message import AnswerMessageMigration
from core.modules.questions.migrations.m004_question_place import QuestionPlaceMigration
from core.modules.questions.models.question import Question
from core.modules.questions.seeders.questions_seeder import QuestionsSeeder
from core.modules.questions.upgrade.questions_move import QuestionsMove
from core.modules.questions.upgrade.question_links_move import QuestionLinksMove
from core.modules.questions.support.block_conditions.question_answered import QuestionAnswered
from core.modules.questions.support.block_conditions.questions_closed import QuestionsClosed
from core.modules.questions.support.skeletons import QUESTIONS_QUESTIONS_SKELETON, QUESTIONS_QUESTION_SKELETON, QUESTIONS_WAITING_SKELETON


class QuestionsModule(Module):
    """Adds questions an agent asks the user, with the options it offers and the answer it gets."""

    name = "journal.core.questions"
    nudges = QUESTION_NUDGES
    requires_core = ">=5,<6"
    block_conditions = [QuestionAnswered, QuestionsClosed]
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents", "journal.core.messages", "journal.core.waits", "journal.core.chat", "journal.core.documents", "journal.core.tasks", "journal.core.plans"]
    models = [ModelDeclaration(Question, query=QuestionQuery, commands=(AnswerQuestion, CloseQuestion), excluded_subcommands=["make", "list", "show"])]
    migrations = [QuestionEnvironmentStateIndexMigration, QuestionSessionMigration, QuestionAgentStateIndexMigration, QuestionsTablesMigration, AnswerMessageMigration, QuestionPlaceMigration, QuestionContextMigration]
    moves = [QuestionsMove, QuestionLinksMove]
    subcommands = [AskQuestionSubcommand, QuestionListSubcommand, QuestionShowSubcommand]
    handlers = [AskQuestionHandler, AnswerQuestionHandler]
    guards = [MainAgentGuard, ActorOptionsGuard]
    driver_rules = [QuestionAnsweredRule, QuestionClosedRule, OwnQuestionToolRule]
    marks = QUESTION_MARKS
    listeners = [OpenQuestionsDockListener, QuestionOpenMarkListener, QuestionEditedMarkListener, QuestionAnsweredMarkListener, QuestionClosedMarkListener]
    docks = QUESTION_DOCKS
    windows = [WindowDeclaration("questions.questions", "Questions", "questions.js", WindowLoading.COMPONENT, skeleton=QUESTIONS_QUESTIONS_SKELETON, icon=WindowIcon.QUESTION,
                                 reads=["question list", "question show"],
                                 keys=[WindowKey("questions", "question list --all", tab="list", events=["question.*"]),
                                       WindowKey("question.*", "question show {id}", events=["question.*"], loading=KeyLoading.REQUESTED)],
                                 runs=["question answer", "question close", "message send"], events=["question.*"],
                                 search=WindowSearch(QuestionSearcher, "Search the questions")),
               WindowDeclaration("questions.question", "Question", "question-card.js", WindowLoading.COMPONENT, skeleton=QUESTIONS_QUESTION_SKELETON, place=WindowPlace.DROPDOWN, icon=WindowIcon.QUESTION,
                                 reads=["question show"], keys=[WindowKey("question.*", "question show {id}", events=["question.*"], loading=KeyLoading.REQUESTED)],
                                 runs=["question answer", "question close", "message send"], events=["question.*"]),
               WindowDeclaration("questions.waiting", "Waiting", "waiting.js", WindowLoading.COMPONENT, skeleton=QUESTIONS_WAITING_SKELETON, icon=WindowIcon.HALT,
                                 reads=["wait waiting"], events=["wait.*"])]
    seeders = [QuestionsSeeder]
