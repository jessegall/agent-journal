from argparse import Namespace
from datetime import datetime, timezone

from journal.console.command import Command
from journal.support.caller import Caller
from journal.models.author import Author
from journal.models.message import Message
from journal.support.ref import Ref
from journal.config import Config
from journal.features.messages.support.faces import Faces
from journal.support.missing_row import MissingRow
from journal.repositories.agents import Agents
from journal.repositories.docs import Docs
from journal.repositories.reports import Reports
from journal.repositories.messages import Messages
from journal.repositories.links import Links
from journal.repositories.reactions import Reactions

RECENT = 20


class MessageCommand(Command):
    noun = "message"

    def __init__(self, messages: Messages, reactions: Reactions, links: Links, config: Config, agents: Agents, docs: Docs, reports: Reports) -> None:
        self.agents = agents
        self.messages, self.reactions, self.links, self.config = messages, reactions, links, config
        self.docs, self.reports = docs, reports

    def arguments(self, verbs) -> None:
        transmit = self.verb(verbs, "send", "leave a message")
        transmit.add_argument("text")
        transmit.add_argument("--reply-to", type=int, default=None)
        transmit.add_argument("--confirm", action="store_true", help="send a second reply to a message already answered")
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

    def send(self, args: Namespace, caller: Caller) -> int:
        author = Author.build(caller.actor)
        if args.reply_to and author == Author.AGENT:
            return self.reply(args, caller)
        draft = Message(author=author, text=args.text, reply_to=args.reply_to)
        message = self.messages.save(draft.arrived() if author == Author.USER else draft, caller.actor)
        print(f"message {message.id} sent")
        return 0

    def reply(self, args: Namespace, caller: Caller) -> int:
        answered = self.messages.find(args.reply_to)
        if self.messages.reply_text(answered.id, args.text):
            print(f"message {answered.id} already has this reply in the chat: not sent again")
            return 0
        older = self.messages.first_reply(answered)
        if older is not None and not args.confirm:
            print(f"message {answered.id} already has your reply {older.id}: not sent. Send it again only if it says something new, with --confirm")
            return 1
        message = self.messages.save(Message(author=Author.AGENT, text=args.text, reply_to=answered.id), caller.actor)
        self.messages.read(answered, caller.actor, self._tool_use(caller))
        print(f"message {message.id} sent")
        return 0

    def list(self, args: Namespace, caller: Caller) -> int:
        for message in self.messages.scoped():
            threshold = " " if message.read_at else "*"
            print(f"{threshold}{message.id:>4}  {message.author:<5} {message.text_body}")
        return 0

    def read(self, args: Namespace, caller: Caller) -> int:
        self.show(self.messages.read(self.messages.find(args.n), caller.actor, self._tool_use(caller)))
        return 0

    def unread(self, args: Namespace, caller: Caller) -> int:
        waiting = self.messages.unread()
        if not waiting:
            print("nothing unread")
        for message in waiting:
            self.show(self.messages.read(message, caller.actor, self._tool_use(caller)))
        return 0

    def recent(self, args: Namespace, caller: Caller) -> int:
        for message in self.messages.recent(RECENT):
            print(f"{message.id:>4}  {message.author:<5} {message.text_body}")
        return 0

    def react(self, args: Namespace, caller: Caller) -> int:
        if args.face not in Faces.ALL:
            print(f"a reaction is one of {' '.join(Faces.ALL)}")
            return 1
        author = Author.build(caller.actor)
        message = self.messages.find(args.n)
        reaction = self.reactions.toggle(message, args.face, author, caller.actor)
        if reaction and author == Author.AGENT:
            self.messages.read(message, caller.actor, self._tool_use(caller))
        print(f"{args.face} {'on' if reaction else 'off'} message {args.n}")
        return 0

    def tag(self, args: Namespace, caller: Caller) -> int:
        message = self.messages.find(args.n)
        if args.name not in message.files:
            print(f"message {args.n} has no file named {args.name}")
            return 1
        self.messages.save(message.with_(captions={**message.captions, args.name: args.caption}), caller.actor)
        print(f"{args.name} on message {args.n}: {args.caption}")
        return 0

    @staticmethod
    def reply_target(message: Message) -> str:
        if message.reply_to:
            return f", a reply to message {message.reply_to}"
        return ", on the passage quoted below it" if message.quoted_lines else ""

    def show(self, message: Message) -> None:
        print(f"message {message.id} from {message.sender}{self.reply_target(message)}: {message.text_body}")
        for line in message.quote.split("\n") if message.is_passage_comment else ():
            print(f"  > {line}")
        for name in message.files:
            path = self.config.files / "message" / str(message.id) / name
            viewed = message.captions.get(name)
            print(f"  file {path}" + (f": {viewed}" if viewed else f" (open it, then `journal message tag {message.id} \"{name}\" \"<what it shows>\"`)"))
        for link in self.links.link_rows(message):
            counterpart = link.target if link.source == Ref.build(message) else link.source
            print(f"  {link.kind} {counterpart}")
            if link.kind == Messages.COMMENT_LINK and message.is_passage_comment:
                print(self.passage_place(counterpart, message.quote))
        print(f"  reply with [!reply:{message.id}] in your turn")
        print(f"  steering? take it as steering. something to do? file it: `journal task create \"<title>\" --from {message.id}`")

    def _tool_use(self, caller: Caller) -> int:
        agents = self.agents.global_matching(session=caller.session) if caller.session else [agent for agent in (self.agents.current(),) if agent]
        return agents[0].tool_uses if agents else 0

    def passage_place(self, ref: Ref, quote: str) -> str:
        texts = {"docs": ("doc", self.docs), "reports": ("report", self.reports)}
        if ref.type not in texts:
            return ""
        noun, repository = texts[ref.type]
        lines = repository.find(ref.id).body.split("\n")
        first = quote.split("\n")[0].strip()
        start = next((i for i, line in enumerate(lines) if line.strip() == first), -1)
        if start < 0:
            return f"  the passage is not in {noun} {ref.id} as it stands now"
        end = start + quote.count("\n")
        section = sum(1 for line in lines[: start + 1] if line.startswith("## "))
        heading = next((line[3:] for line in reversed(lines[: start + 1]) if line.startswith("## ")), "")
        line_numbers = f"lines {start + 1}-{end + 1}" if end > start else f"line {start + 1}"
        location = f"section {section}, {heading}, {line_numbers}" if section else line_numbers
        return f"  the passage sits in {noun} {ref.id} at {location}: `journal {noun} show {ref.id} --section {section or 1}` or `--grep`"
