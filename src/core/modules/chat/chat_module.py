from core.modules.chat.models.declarations.chat_mark_model_declaration import ChatMarkModelDeclaration
from core.modules.chat.models.declarations.journal_exception_model_declaration import JournalExceptionModelDeclaration
from core.modules.chat.migrations.m009_environment_index import JournalExceptionsEnvironmentIndexMigration
from core.modules.chat.migrations.m007_chat_mark_session import ChatMarkSessionMigration
from core.modules.chat.migrations.m005_chat_mark_agent_index import ChatMarkAgentIndexMigration
from engine.module.module import Module
from core.modules.chat.marks.chat_exception_mark import ChatExceptionMark
from core.modules.chat.marks.chat_upgrade_mark import ChatUpgradeMark
from core.modules.chat.marks.chat_private_data_mark import ChatPrivateDataMark
from engine.log.exception_sink import ExceptionSink
from core.modules.chat.commands.record_journal_exception.record_journal_exception_handler import RecordJournalExceptionHandler
from core.modules.chat.commands.solve_journal_exception.solve_journal_exception_handler import SolveJournalExceptionHandler
from core.modules.chat.commands.solve_journal_exception.solve_journal_exception_subcommand import SolveJournalExceptionSubcommand
from core.modules.chat.listeners.journal_exception_mark_listener import JournalExceptionMarkListener
from core.modules.chat.listeners.upgrade_mark_listener import UpgradeMarkListener
from core.modules.chat.migrations.m002_journal_exceptions import JournalExceptionTableMigration
from core.modules.chat.migrations.m003_chat_mark_key_index import ChatMarkKeyIndexMigration
from core.modules.chat.migrations.m004_journal_exceptions_renamed import JournalExceptionRenameMigration
from core.modules.chat.migrations.m006_journal_exception_created_index import JournalExceptionCreatedIndexMigration
from core.modules.chat.support.chat_exception_sink import ChatExceptionSink
from core.modules.chat.commands.show_mark.show_mark_handler import ShowMarkHandler
from core.modules.chat.guards.mark_type_guard import MarkTypeGuard
from core.modules.chat.migrations.m001_chat_marks import ChatMarkTableMigration
from core.modules.chat.migrations.m008_chat_mark_all_key_index import ChatMarkAnyEnvironmentKeyIndexMigration
from core.modules.chat.support.chat_settings import CHAT_SETTINGS


class ChatModule(Module):
    """Adds the marks in an environment's chat, of the types modules declare."""

    name = "journal.core.chat"
    seed_reason = "its marks come from the rows of the other modules"
    move_reason = "version 4 kept its chat as messages, which the messages module moves"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.settings"]
    settings = CHAT_SETTINGS
    models = [ChatMarkModelDeclaration, JournalExceptionModelDeclaration]
    migrations = [ChatMarkSessionMigration, JournalExceptionCreatedIndexMigration, ChatMarkAgentIndexMigration, ChatMarkTableMigration, JournalExceptionTableMigration, ChatMarkKeyIndexMigration, JournalExceptionRenameMigration, ChatMarkAnyEnvironmentKeyIndexMigration, JournalExceptionsEnvironmentIndexMigration]
    handlers = [ShowMarkHandler, RecordJournalExceptionHandler, SolveJournalExceptionHandler]
    subcommands = [SolveJournalExceptionSubcommand]
    guards = [MarkTypeGuard]
    marks = [ChatExceptionMark, ChatUpgradeMark, ChatPrivateDataMark]
    listeners = [JournalExceptionMarkListener, UpgradeMarkListener]
    bindings = {ExceptionSink: ChatExceptionSink}
