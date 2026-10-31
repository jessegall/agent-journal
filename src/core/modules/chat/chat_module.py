from core.base.module.model_declaration import ModelDeclaration
from core.base.module.module import Module
from core.modules.chat.commands.show_mark_handler import ShowMarkHandler
from core.modules.chat.guards.declared_type_guard import DeclaredTypeGuard
from core.modules.chat.migrations.m001_chat_marks import ChatMarksTableMigration
from core.modules.chat.models.chat_mark import ChatMark


class ChatModule(Module):
    """Adds the marks in an environment's chat, of the types modules declare."""

    name = "journal.core.chat"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.actors", "journal.core.environments", "journal.core.agents"]
    models = [ModelDeclaration(ChatMark)]
    migrations = [ChatMarksTableMigration]
    handlers = (ShowMarkHandler,)
    guards = [DeclaredTypeGuard]
