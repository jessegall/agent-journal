from core.modules.chat.migrations.m007_chat_mark_session import ChatMarkSessionMigration
from core.modules.chat.migrations.m005_chat_mark_agent_index import ChatMarkAgentIndexMigration
from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.chat.support.chat_marks import CHAT_MARKS
from core.base.exception_sink import ExceptionSink
from core.modules.chat.commands.record_journal_exception.record_journal_exception_handler import RecordJournalExceptionHandler
from core.modules.chat.listeners.journal_exception_mark_listener import JournalExceptionMarkListener
from core.modules.chat.listeners.upgrade_mark_listener import UpgradeMarkListener
from core.modules.chat.migrations.m002_journal_exceptions import JournalExceptionTableMigration
from core.modules.chat.migrations.m003_chat_mark_key_index import ChatMarkKeyIndexMigration
from core.modules.chat.migrations.m004_journal_exceptions_renamed import JournalExceptionRenameMigration
from core.modules.chat.models.journal_exception import JournalException
from core.modules.chat.migrations.m006_journal_exception_created_index import JournalExceptionCreatedIndexMigration
from core.modules.chat.support.chat_exception_sink import ChatExceptionSink
from core.modules.chat.commands.show_mark.show_mark_handler import ShowMarkHandler
from core.modules.chat.guards.mark_type_guard import MarkTypeGuard
from core.modules.chat.migrations.m001_chat_marks import ChatMarkTableMigration
from core.modules.chat.migrations.m008_chat_mark_all_key_index import ChatMarkAnyEnvironmentKeyIndexMigration
from core.modules.chat.queries.chat_mark_query import ChatMarkQuery
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.chat.support.chat_settings import CHAT_SETTINGS


class ChatModule(Module):
    """Adds the marks in an environment's chat, of the types modules declare."""

    name = "journal.core.chat"
    seed_reason = "its marks come from the rows of the other modules"
    move_reason = "version 4 kept its chat as messages, which the messages module moves"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.settings"]
    settings = CHAT_SETTINGS
    models = [ModelDeclaration(ChatMark, query=ChatMarkQuery), ModelDeclaration(JournalException, excluded_subcommands=["make", "edit", "delete"])]
    migrations = [ChatMarkSessionMigration, JournalExceptionCreatedIndexMigration, ChatMarkAgentIndexMigration, ChatMarkTableMigration, JournalExceptionTableMigration, ChatMarkKeyIndexMigration, JournalExceptionRenameMigration, ChatMarkAnyEnvironmentKeyIndexMigration]
    handlers = [ShowMarkHandler, RecordJournalExceptionHandler]
    guards = [MarkTypeGuard]
    marks = CHAT_MARKS
    listeners = [JournalExceptionMarkListener, UpgradeMarkListener]
    bindings = {ExceptionSink: ChatExceptionSink}
