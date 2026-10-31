from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.chat.chat_marks import CHAT_MARKS
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
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]
    models = [ModelDeclaration(ChatMark, query=ChatMarkQuery)]
    migrations = [ChatMarkTableMigration]
    handlers = [ShowMarkHandler]
    guards = [MarkTypeGuard, AgentChatGuard]
    marks = CHAT_MARKS
