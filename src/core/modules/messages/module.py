from core.base.module.module import Module
from core.base.module.noun import Noun
from core.base.registry.dotted_path import DottedPath
from core.modules.messages.message import Message


class MessagesModule(Module):
    """Adds messages: what the user, the agents and the journal say in an environment's chat."""

    name = "messages"
    requires_core = ">=5,<6"
    dependencies = ("actors", "environments", "agents")
    nouns = (Noun(Message, query=DottedPath("core.modules.messages.message_query:MessageQuery"), excluded_subcommands=("make",)),)
    migrations = ("core.modules.messages.migrations.m001_messages:MessagesTable",)
    guards = ("core.modules.messages.guards.one_reply_per_message:OneReplyPerMessage",)
    handlers = ("core.modules.messages.handlers:MessageSendHandler", "core.modules.messages.handlers:MessageReadHandler")
    subcommands = tuple(f"core.modules.messages.subcommands:{name}" for name in ("MessageSendSubcommand", "MessageReplySubcommand", "MessageReadSubcommand"))
