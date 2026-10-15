from argparse import Namespace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.console.where import Where
from journal.models.actor_kind import ActorKind
from journal.models.author import Author
from journal.models.message import Message
from journal.repositories.environments import Environments
from journal.engine.machine import Machine
from journal.features.messages.faces import Faces
from journal.features.messages.states.catching_up import CatchingUp
from journal.repositories.not_found import NotFound
from journal.repositories.messages import Messages
from journal.repositories.reactions import Reactions

RECENT = 20


class MessageCommand(Command):
    noun = "message"

    def __init__(self, messages: Messages, environments: Environments, reactions: Reactions, machine: Machine) -> None:
        self.messages, self.environments, self.reactions, self.machine = messages, environments, reactions, machine

    def arguments(self, verbs) -> None:
        send = self.verb(verbs, "send", "leave a message")
        send.add_argument("text")
        send.add_argument("--reply-to", type=int, default=None)
        self.verb(verbs, "list", "every message here")
        self.verb(verbs, "read", "show a message and mark it read").add_argument("n", type=int)
        self.verb(verbs, "unread", "show every unread message and mark them read")
        self.verb(verbs, "recent", "the latest messages, owed after a compaction")
        react = self.verb(verbs, "react", "put a face on a message, or take it off again")
        react.add_argument("n", type=int)
        react.add_argument("face")

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
        """The words reach the agent here, once it opens the message, with how to answer it."""
        self.show(self.messages.mark_read(self.messages.find(args.n), where.actor))
        return 0

    def unread(self, args: Namespace, where: Where) -> int:
        waiting = self.messages.unread(self.environments.named(where.environment).id)
        if not waiting:
            print("nothing unread")
        for message in waiting:
            self.show(self.messages.mark_read(message, where.actor))
        return 0

    def recent(self, args: Namespace, where: Where) -> int:
        environment = self.environments.named(where.environment)
        for message in self.messages.recent(environment.id, RECENT):
            print(f"{message.id:>4}  {message.author:<5} {message.text}")
        self._caught_up(where, environment.id)
        return 0

    def _caught_up(self, where: Where, environment_id: int) -> None:
        if not where.session:
            return
        try:
            current = self.machine.current(where.session)
        except NotFound:
            return
        if isinstance(current, CatchingUp):
            self.machine.move(where.session, environment_id, current.back().to)

    def react(self, args: Namespace, where: Where) -> int:
        if args.face not in Faces.ALL:
            print(f"a reaction is one of {' '.join(Faces.ALL)}")
            return 1
        author = Author.AGENT if where.actor.kind == ActorKind.AGENT else Author.USER
        message = self.messages.find(args.n)
        made = self.reactions.toggle(message, args.face, author, where.actor)
        if made and author == Author.AGENT:
            self.messages.mark_read(message, where.actor)
        print(f"{args.face} {'on' if made else 'off'} message {args.n}")
        return 0

    @staticmethod
    def show(message: Message) -> None:
        print(f"message {message.id} from the {message.author}: {message.text}")
        print(f"  reply with [!reply:{message.id}] in your turn")
