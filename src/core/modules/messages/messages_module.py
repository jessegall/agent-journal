from core.modules.messages.declarations.messages_dependencies import MESSAGES_DEPENDENCIES
from core.modules.messages.declarations.messages_migrations import MESSAGES_MIGRATIONS
from core.modules.messages.declarations.messages_handlers import MESSAGES_HANDLERS
from core.modules.messages.declarations.messages_lines import MESSAGES_LINES
from core.modules.messages.declarations.messages_effects import MESSAGES_EFFECTS
from core.modules.messages.declarations.messages_subcommands import MESSAGES_SUBCOMMANDS
from core.modules.messages.declarations.messages_listeners import MESSAGES_LISTENERS
from core.modules.messages.wake_causes.person_message_wake import PersonMessageWake
from core.modules.messages.listeners.message_step_listener import MessageStepListener
from core.modules.messages.states.unread_message_states import UnreadMessageStates
from core.modules.messages.states.unanswered_message_states import UnansweredMessageStates
from core.modules.messages.policies.unread_message_show_policy import UnreadMessageShowPolicy
from core.modules.messages.windows.messages_windows import MESSAGES_WINDOWS
from core.modules.messages.models.declarations.message_model_declaration import MessageModelDeclaration
from core.modules.messages.models.declarations.message_work_source_model_declaration import MessageWorkSourceModelDeclaration
from core.modules.messages.skills.declarations.messages_skills import MESSAGES_SKILLS
from core.modules.messages.support.message_agent_messages import MESSAGE_AGENT_MESSAGES
from core.modules.messages.guards.one_reply_per_message_guard import OneReplyPerMessageGuard
from core.modules.messages.guards.repeated_message_guard import RepeatedMessageGuard
from core.modules.messages.guards.question_message_guard import QuestionMessageGuard
from core.modules.messages.models.attached_file import AttachedFile
from core.modules.messages.models.chat_message import ChatMessage
from core.modules.messages.models.main_chat_mark import MainChatMark
from core.modules.environments.support.environment_activity import EnvironmentActivity
from core.modules.messages.bindings.message_environment_activity import MessageEnvironmentActivity
from engine.module.module import Module
from core.modules.messages.upgrade.messages_move import MessagesMove
from core.modules.messages.marks.message_summary_mark import MessageSummaryMark
from core.modules.messages.marks.message_filed_mark import MessageFiledMark
from core.modules.messages.marks.message_edited_mark import MessageEditedMark
from core.modules.messages.seeders.messages_seeder import MessagesSeeder
from core.modules.messages.support.block_conditions.messages_read import MessagesRead
from core.modules.messages.support.block_conditions.messages_answered import MessagesAnswered
from core.modules.messages.support.message_settings import MESSAGE_SETTINGS


class MessagesModule(Module):
    """Adds messages: what the user, the agents and the journal say in an environment's chat."""

    name = "journal.core.messages"
    agent_listeners = [MessageStepListener]
    agent_messages = MESSAGE_AGENT_MESSAGES
    settings = MESSAGE_SETTINGS
    requires_engine = ">=5,<6"
    block_conditions = [MessagesRead, MessagesAnswered]
    dependencies = MESSAGES_DEPENDENCIES
    models = [MessageModelDeclaration, MessageWorkSourceModelDeclaration]
    bindings = {EnvironmentActivity: MessageEnvironmentActivity}
    moves = [MessagesMove]
    views = [AttachedFile, ChatMessage, MainChatMark]
    migrations = MESSAGES_MIGRATIONS
    guards = [OneReplyPerMessageGuard, RepeatedMessageGuard, QuestionMessageGuard]
    handlers = MESSAGES_HANDLERS
    states = [UnreadMessageStates, UnansweredMessageStates]
    policies = [UnreadMessageShowPolicy]
    lines = MESSAGES_LINES
    effects = MESSAGES_EFFECTS
    subcommands = MESSAGES_SUBCOMMANDS
    windows = MESSAGES_WINDOWS
    marks = [MessageSummaryMark, MessageFiledMark, MessageEditedMark]
    skills = MESSAGES_SKILLS
    wake_causes = [PersonMessageWake]
    listeners = MESSAGES_LISTENERS
    seeders = [MessagesSeeder]
