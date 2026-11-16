from core.modules.questions.declarations.questions_dependencies import QUESTIONS_DEPENDENCIES
from core.modules.questions.declarations.questions_migrations import QUESTIONS_MIGRATIONS
from core.modules.questions.declarations.questions_listeners import QUESTIONS_LISTENERS
from core.modules.questions.policies.own_question_tool_policy import OwnQuestionToolPolicy
from core.modules.questions.models.declarations.question_model_declaration import QuestionModelDeclaration
from core.modules.questions.docks.questions_docks import QUESTIONS_DOCKS
from core.modules.questions.windows.questions_windows import QUESTIONS_WINDOWS
from core.modules.questions.support.question_agent_messages import QUESTION_AGENT_MESSAGES
from engine.module.module import Module
from core.modules.questions.commands.answer_question.answer_question_handler import AnswerQuestionHandler
from core.modules.questions.commands.ask_question.ask_question_handler import AskQuestionHandler
from core.modules.questions.commands.ask_question.ask_question_subcommand import AskQuestionSubcommand
from core.modules.questions.commands.question_list.question_list_subcommand import QuestionListSubcommand
from core.modules.questions.commands.question_show.question_show_subcommand import QuestionShowSubcommand
from core.modules.questions.marks.question_mark import QuestionMark
from core.modules.questions.marks.question_answer_mark import QuestionAnswerMark
from core.modules.questions.guards.question_asker_guard import QuestionAskerGuard
from core.modules.questions.guards.actor_options_guard import ActorOptionsGuard
from core.modules.questions.seeders.questions_seeder import QuestionsSeeder
from core.modules.questions.upgrade.questions_move import QuestionsMove
from core.modules.questions.upgrade.question_links_move import QuestionLinksMove
from core.modules.questions.support.block_conditions.question_answered import QuestionAnswered
from core.modules.questions.support.block_conditions.questions_closed import QuestionsClosed
from core.modules.questions.inspectors.question_inspector import QuestionInspector


class QuestionsModule(Module):
    """Adds questions an agent asks the user, with the options it offers and the answer it gets."""

    name = "journal.core.questions"
    policies = [OwnQuestionToolPolicy]
    agent_messages = QUESTION_AGENT_MESSAGES
    requires_engine = ">=6,<7"
    block_conditions = [QuestionAnswered, QuestionsClosed]
    dependencies = QUESTIONS_DEPENDENCIES
    models = [QuestionModelDeclaration]
    migrations = QUESTIONS_MIGRATIONS
    moves = [QuestionsMove, QuestionLinksMove]
    subcommands = [AskQuestionSubcommand, QuestionListSubcommand, QuestionShowSubcommand]
    handlers = [AskQuestionHandler, AnswerQuestionHandler]
    guards = [QuestionAskerGuard, ActorOptionsGuard]
    marks = [QuestionMark, QuestionAnswerMark]
    listeners = QUESTIONS_LISTENERS
    docks = QUESTIONS_DOCKS
    windows = QUESTIONS_WINDOWS
    inspectors = [QuestionInspector]
    seeders = [QuestionsSeeder]
