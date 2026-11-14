from engine.module.model_declaration import ModelDeclaration
from core.modules.messages.models.message import Message
from core.modules.messages.queries.message_query import MessageQuery


class MessageModelDeclaration(ModelDeclaration):
    """How the module declares Message."""

    model = Message
    query = MessageQuery
    excluded_subcommands = ["make"]
