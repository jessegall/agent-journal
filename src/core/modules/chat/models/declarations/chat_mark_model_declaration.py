from engine.module.model_declaration import ModelDeclaration
from core.modules.chat.models.chat_mark import ChatMark
from core.modules.chat.queries.chat_mark_query import ChatMarkQuery


class ChatMarkModelDeclaration(ModelDeclaration):
    """How the module declares ChatMark."""

    model = ChatMark
    query = ChatMarkQuery
