from argparse import Namespace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.support.where import Where
from journal.models.author import Author
from journal.models.message import Message
from journal.support.ref import Ref
from journal.config import Config
from journal.features.messages.support.faces import Faces
from journal.support.not_found import NotFound
from journal.repositories.agents import Agents
from journal.repositories.messages import Messages
from journal.repositories.links import Links
from journal.repositories.reactions import Reactions

RECENT = 20


class MessageCommand(Command):
    noun = "message"

    def __init__(self, messages: Messages, reactions: Reactions, links: Links, config: Config, agents: Agents) -> None:
        self.agents = agents
        self.messages, self.reactions, self.links, self.config = messages, reactions, links, config

    def arguments(self, verbs) -> None:
        send = self.verb(verbs, "send", "leave a message")
        send.add_argument("text")
        send.add_argument("--reply-to", type=int, default=None)
        send.add_argument("--confirm", action="store_true", help="send a second reply to a message already answered")
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
        author = Author.of(where.actor)
        if args.reply_to and author == Author.AGENT:
            return self.reply(args, where)
        draft = Message(author=author, text=args.text, reply_to=args.reply_to)
        message = self.messages.save(draft.arrived() if author == Author.USER else draft, where.actor)
        print(f"message {message.id} sent")
        return 0

    def reply(self, args: Namespace, where: Where) -> int:
        answered = self.messages.find(args.reply_to)
        if self.messages.reply_saying(answered.id, args.text):
            print(f"message {answered.id} already has this reply in the chat: not sent again")
            return 0
        earlier = self.messages.first_reply(answered)
        if earlier is not None and not args.confirm:
            print(f"message {answered.id} already has your reply {earlier.id}: not sent. Send it again only if it says something new, with --confirm")
            return 1
        message = self.messages.save(Message(author=Author.AGENT, text=args.text, reply_to=answered.id), where.actor)
        self.messages.mark_read(answered, where.actor, self._tool_use(where))
        print(f"message {message.id} sent")
        return 0

    def list(self, args: Namespace, where: Where) -> int:
        for message in self.messages.in_():
            mark = " " if message.read_at else "*"
            print(f"{mark}{message.id:>4}  {message.author:<5} {message.own_words}")
        return 0

    def read(self, args: Namespace, where: Where) -> int:
        self.show(self.messages.mark_read(self.messages.find(args.n), where.actor, self._tool_use(where)))
        return 0

    def unread(self, args: Namespace, where: Where) -> int:
        waiting = self.messages.unread()
        if not waiting:
            print("nothing unread")
        for message in waiting:
            self.show(self.messages.mark_read(message, where.actor, self._tool_use(where)))
        return 0

    def recent(self, args: Namespace, where: Where) -> int:
        for message in self.messages.recent(RECENT):
            print(f"{message.id:>4}  {message.author:<5} {message.own_words}")
        return 0

    def react(self, args: Namespace, where: Where) -> int:
        if args.face not in Faces.ALL:
            print(f"a reaction is one of {' '.join(Faces.ALL)}")
            return 1
        author = Author.of(where.actor)
        message = self.messages.find(args.n)
        reaction = self.reactions.toggle(message, args.face, author, where.actor)
        if reaction and author == Author.AGENT:
            self.messages.mark_read(message, where.actor, self._tool_use(where))
        print(f"{args.face} {'on' if reaction else 'off'} message {args.n}")
        return 0

    def tag(self, args: Namespace, where: Where) -> int:
        message = self.messages.find(args.n)
        if args.name not in message.files:
            print(f"message {args.n} has no file named {args.name}")
            return 1
        self.messages.save(message.with_(captions={**message.captions, args.name: args.caption}), where.actor)
        print(f"{args.name} on message {args.n}: {args.caption}")
        return 0

    @staticmethod
    def answering(message: Message) -> str:
        if message.reply_to:
            return f", a reply to message {message.reply_to}"
        return ", on the passage quoted below it" if message.quoted_lines else ""

    def show(self, message: Message) -> None:
        print(f"message {message.id} from {message.sender}{self.answering(message)}: {message.own_words}")
        for line in message.quote.split("\n") if message.is_on_a_passage else ():
            print(f"  > {line}")
        for name in message.files:
            path = self.config.files / "message" / str(message.id) / name
            seen = message.captions.get(name)
            print(f"  file {path}" + (f": {seen}" if seen else f" (open it, then `journal message tag {message.id} \"{name}\" \"<what it shows>\"`)"))
        for link in self.links.of(message):
            other = link.target if link.source == Ref.to(message) else link.source
            print(f"  {link.kind} {other}")
        print(f"  reply with [!reply:{message.id}] in your turn")
        print(f"  steering? take it as steering. something to do? file it: `journal task create \"<title>\" --from {message.id}`")

    def _tool_use(self, where: Where) -> int:
        agents = self.agents.across_environments(session=where.session) if where.session else [agent for agent in (self.agents.live(),) if agent]
        return agents[0].tool_uses if agents else 0
