from argparse import Namespace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.console.where import Where
from journal.models.actor_kind import ActorKind
from journal.models.author import Author
from journal.models.message import Message
from journal.models.ref import Ref
from journal.config import Config
from journal.features.messages.faces import Faces
from journal.repositories.not_found import NotFound
from journal.repositories.messages import Messages
from journal.repositories.links import Links
from journal.repositories.reactions import Reactions

RECENT = 20


class MessageCommand(Command):
    noun = "message"

    def __init__(self, messages: Messages, reactions: Reactions, links: Links, config: Config) -> None:
        self.messages, self.reactions, self.links, self.config = messages, reactions, links, config

    def arguments(self, verbs) -> None:
        send = self.verb(verbs, "send", "leave a message")
        send.add_argument("text")
        send.add_argument("--reply-to", type=int, default=None)
        self.verb(verbs, "list", "every message here")
        self.verb(verbs, "read", "show a message and mark it read").add_argument("n", type=int)
        self.verb(verbs, "unread", "show every unread message and mark them read")
        self.verb(verbs, "recent", "the latest messages")
        tag = self.verb(verbs, "tag", "say what an attached picture shows, so it can be found later")
        tag.add_argument("n", type=int)
        tag.add_argument("name")
        tag.add_argument("caption")
        react = self.verb(verbs, "react", "put a face on a message, or take it off again")
        react.add_argument("n", type=int)
        react.add_argument("face")

    def send(self, args: Namespace, where: Where) -> int:
        author = Author.AGENT if where.actor.kind == ActorKind.AGENT else Author.USER
        message = self.messages.save(Message(author=author, text=args.text, reply_to=args.reply_to), where.actor)
        if args.reply_to and author == Author.AGENT:
            self.messages.mark_read(self.messages.find(args.reply_to), where.actor)
        print(f"message {message.id} sent")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for message in self.messages.in_():
            mark = " " if message.read_at else "*"
            print(f"{mark}{message.id:>4}  {message.author:<5} {message.text}")
        return 0

    def read(self, args: Namespace, where: Where) -> int:
        """The words reach the agent here, once it opens the message, with how to answer it."""
        self.show(self.messages.mark_read(self.messages.find(args.n), where.actor))
        return 0

    def unread(self, args: Namespace, where: Where) -> int:
        waiting = self.messages.unread()
        if not waiting:
            print("nothing unread")
        for message in waiting:
            self.show(self.messages.mark_read(message, where.actor))
        return 0

    def recent(self, args: Namespace, where: Where) -> int:
        for message in self.messages.recent(RECENT):
            print(f"{message.id:>4}  {message.author:<5} {message.text}")
        return 0

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

    def tag(self, args: Namespace, where: Where) -> int:
        message = self.messages.find(args.n)
        if args.name not in message.files:
            print(f"message {args.n} has no file named {args.name}")
            return 1
        self.messages.save(message.with_(captions={**message.captions, args.name: args.caption}), where.actor)
        print(f"{args.name} on message {args.n}: {args.caption}")
        return 0

    def show(self, message: Message) -> None:
        """The message, its files with where to open them and what they show, and the rows it is linked to."""
        print(f"message {message.id} from the {message.author}: {message.text}")
        for name in message.files:
            path = self.config.home / "files" / "message" / str(message.id) / name
            seen = message.captions.get(name)
            print(f"  file {path}" + (f": {seen}" if seen else f" (open it, then `journal message tag {message.id} \"{name}\" \"<what it shows>\"`)"))
        for link in self.links.of(message):
            other = link.target if link.source == Ref.to(message) else link.source
            print(f"  {link.kind} {other}")
        print(f"  reply with [!reply:{message.id}] in your turn")
        print(f"  steering? take it as steering. something to do? file it: `journal task create \"<title>\" --from {message.id}`")
