from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.chat.support.chat_marks import CHAT_MARKS
from core.base.fault_sink import FaultSink
from core.modules.chat.commands.record_journal_fault_handler import RecordJournalFaultHandler
from core.modules.chat.listeners.journal_fault_mark_listener import JournalFaultMarkListener
from core.modules.chat.migrations.m002_journal_faults import JournalFaultTableMigration
from core.modules.chat.models.journal_fault import JournalFault
from core.modules.chat.support.chat_fault_sink import ChatFaultSink
from core.modules.chat.commands.show_mark_handler import ShowMarkHandler
from core.modules.chat.guards.agent_chat_guard import AgentChatGuard
from core.modules.chat.guards.mark_type_guard import MarkTypeGuard
from core.modules.chat.migrations.m001_chat_marks import ChatMarkTableMigration
from core.modules.chat.queries.chat_mark_query import ChatMarkQuery
from core.modules.chat.models.chat_mark import ChatMark


class ChatModule(Module):
    """Adds the marks in an environment's chat, of the types modules declare."""

    name = "journal.core.chat"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments"]
    models = [ModelDeclaration(ChatMark, query=ChatMarkQuery), ModelDeclaration(JournalFault, excluded_subcommands=["make", "edit", "delete"])]
    migrations = [ChatMarkTableMigration, JournalFaultTableMigration]
    handlers = [ShowMarkHandler, RecordJournalFaultHandler]
    guards = [MarkTypeGuard, AgentChatGuard]
    marks = CHAT_MARKS
    listeners = [JournalFaultMarkListener]
    bindings = [(FaultSink, ChatFaultSink)]
