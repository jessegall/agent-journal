from argparse import Namespace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.console.where import Where
from journal.models.actor_kind import ActorKind
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.environments import Environments
from journal.repositories.messages import Messages


class MessageCommand(Command):
    noun = "message"

    def __init__(self, messages: Messages, environments: Environments) -> None:
        self.messages, self.environments = messages, environments

    def arguments(self, verbs) -> None:
        send = self.verb(verbs, "send", "leave a message")
        send.add_argument("text")
        send.add_argument("--reply-to", type=int, default=None)
        self.verb(verbs, "list", "every message here")
        self.verb(verbs, "read", "mark a message read").add_argument("n", type=int)

    def send(self, args: Namespace, where: Where) -> int:
        author = Author.AGENT if where.actor.kind == ActorKind.AGENT else Author.USER
        message = self.messages.save(Message(environment_id=self.environments.named(where.environment).id, author=author, text=args.text, reply_to=args.reply_to), where.actor)
        if args.reply_to and author == Author.AGENT:
            self.messages.mark_read(self.messages.find(args.reply_to), where.actor)
        print(f"message {message.id} sent")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for message in self.messages.in_(self.environments.named(where.environment).id):
            mark = " " if message.read_at else "*"
            print(f"{mark}{message.id:>4}  {message.author:<5} {message.text}")
        return 0

    def read(self, args: Namespace, where: Where) -> int:
        """Shows the message's words and marks it read: the words reach the agent here, once it opens the message."""
        message = self.messages.mark_read(self.messages.find(args.n), where.actor)
        print(f"message {message.id} from the {message.author}: {message.text}")
        return 0
