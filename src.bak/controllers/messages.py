import time
from itertools import dropwhile

from controllers.base import Controller, CONTROLLERS
from resources import types
from resources.base import AGENT, SYSTEM, USER, Refused, Resource, titled
from resources.replies import ACKNOWLEDGING, ASKING
from resources.text import QUOTE, only_emoji, unquoted  # noqa: F401  its home is resources, and callers still name it here
from controllers.comments import Comments
from controllers.reactions import Reactions
from controllers.marks import action


SAID_JUST_NOW = 60.0


def references(about: str, todos: str) -> list[str]:
    """What a reply says it is about: any row by its reference, and to-dos by their numbers alone, since a reply naming to-dos is the common case."""
    named = [one.strip() for one in str(about).replace(",", " ").split() if one.strip()]
    numbers = [one.strip() for one in str(todos).replace(",", " ").split() if one.strip()]
    return list(dict.fromkeys([*named, *(f"todo:{one}" for one in numbers)]))



class Messages(Controller):
    resource = types.Message

    def is_asking(self, message) -> bool:
        return bool(ASKING.search(f"{message.title}\n{message.brief}"))

    def is_acknowledgement(self, message) -> bool:
        return not self.is_asking(message) and not message.files and bool(ACKNOWLEDGING.match(message.brief or message.title))

    def is_replied(self, message) -> bool:
        return any(r.author == AGENT for r in Comments(self.record, actor=SYSTEM).linked_to(message.ref))

    def is_answered(self, message) -> bool:
        if self.is_asking(message):
            return self.is_replied(message)
        if message.refs or message.sections:
            return True
        return self.is_replied(message) or any(r.author == AGENT for r in Reactions(self.record, actor=SYSTEM).linked_to(message.ref))

    def is_settled_by(self, kind: str, message) -> bool:
        """Whether an answer of this kind, written just now, settles the message: a reply always does, a reaction unless the message asks."""
        return kind == "comment" or not self.is_asking(message)

    @action
    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data):
        return super().update(n, titled(brief) if title is None and brief is not None else title, abstract, brief, outcome, **data)

    @action
    def delete(self, n: int, why: str = "") -> Resource:
        if self.actor != SYSTEM and self.load(n).author != USER:
            self._refuse(f"message {n} was not written by you: only a message you sent can be deleted")
        return super().delete(n, why)

    def _imported(self, turns: list[tuple[str, str, float]], outcome: str) -> None:
        with self.record.locked():
            for actor, text, at in turns:
                self.rows.write_file(self.resource(n=self.rows.draw_number(), title=titled(text.strip().splitlines()[0]), brief=text, seen=[actor, USER if actor == AGENT else AGENT],
                                               created=at, updated=at, completed=at, outcome=outcome))

    @action
    def waiting(self) -> list:
        return [m for m in self.rows.standing() if m.author != AGENT]

    @action
    def file(self, n: int, name: str, into: str = "keep"):
        r = self.load(n)
        if name not in r.files:
            raise Refused(f"message {n} has no file {name}")
        if into == "keep":
            r.files[name] = "kept"
            return self.save(r, "updated", kept=name)
        kind, _, num = into.partition(" ")
        docs = CONTROLLERS[kind](self.record, actor=self.actor)
        docs.attach(int(num), str(self.folder(n) / name), f"from message {n}")
        r.files[name] = f"filed into {kind} {num}"
        return self.save(r, "updated", filed=name, into=into)

    @action
    def archive(self, n: int, why: str):
        return super().delete(n, why)

    @action
    def process(self, n: int, part: str, result: str):
        r = self.peek(n)
        if part not in r.title and part not in r.brief:
            raise Refused(f"that part is not in message {n}; quote the words it is about")
        for kind, _, num in (w.strip().replace(" ", ":").partition(":") for w in result.split(",")):
            if kind in CONTROLLERS and num.isdigit():
                self.link(n, f"{kind}:{int(num)}")
        return self.section(n, part, result)

    def close_once(self, n: int, how: str) -> Resource | None:
        """Closes a message unless it is closed already, whoever got there first, so a second handler or thread asking is no failure."""
        with self.record.locked(self.resource.scope):
            return None if self.load(n).completed else self.complete(n, how)

    def _unopened_pictures(self, n: int) -> list[str]:
        """The pictures on a message that nobody has said what they show. A tag is the proof the file was opened, and a guess at what a screenshot says is worse than no answer at all."""
        r = self.load(n)
        return [name for name in r.pictures if not str(r.files.get(name, "")).strip()]

    @action
    def reply(self, n: str, text: str, file: str = "", about: str = "", todos: str = ""):
        numbers = [int(part) for part in str(n).replace(",", " ").split()]
        if not numbers:
            self._refuse("name the message to reply to: journal message reply <n> \"<text>\", or several as 12,13")
        if only_emoji(text):
            self._refuse(f"a reply that is only {text.strip()} is a reaction: journal message react {numbers[0]} \"{text.strip()}\"")
        unread = [number for number in numbers if self.actor == AGENT and AGENT not in self.load(number).seen]
        if unread and len(numbers) == 1:
            self._refuse(f"read message {unread[0]} before you answer it: journal message read {unread[0]}")
        for number in unread:
            self.read(number)
        unopened = [f"message {number} {name}" for number in numbers for name in self._unopened_pictures(number)]
        if unopened and self.actor == AGENT:
            self._refuse(f"open the picture before you answer it: {', '.join(unopened)}. "
                         f"Read each file, then journal message tag <n> \"<name>\" \"<what it shows>\"")
        skipped, numbers = self._unanswerable(numbers)
        if not numbers:
            self._refuse("; ".join(why for _, why in skipped))
        if skipped:
            from controllers.types import Nudges
            Nudges(self.record, actor=SYSTEM).to_primary("some messages in your reply were not answered", brief="; ".join(why for _, why in skipped))
        quotes = [self._quoted(number) for number in numbers]
        quoted = "\n>\n".join(quote for quote in quotes if quote)
        made = self.comment(numbers[0], f"{quoted}\n\n{text}" if quoted and not text.startswith(">") else text)
        for number in numbers[1:]:
            Comments(self.record, actor=self.actor).link(made.n, f"message:{number}")
            self._mark_commented(number, made)
        if file:
            Comments(self.record, actor=self.actor).attach(made.n, file)
        self._about(numbers, references(about, todos))
        return made

    def _about(self, numbers: list[int], refs: list[str]) -> None:
        """Links the rows a reply is about to the messages it answers, so they are linked in the same act as the answer. Linking is a separate thing to remember otherwise, and anything remembered separately is lost under pressure."""
        for ref in refs:
            kind, _, number = ref.partition(":")
            if kind not in CONTROLLERS or not number.isdigit():
                self._refuse(f"{ref!r} is not a row this reply can be about: write it as <type>:<n>, such as todo:4342")
            if not CONTROLLERS[kind](self.record, actor=SYSTEM).rows.exists(int(number)):
                self._refuse(f"there is no {kind} {number}")
            for message in numbers:
                self.link(message, ref)

    def _unanswerable(self, numbers: list[int]) -> tuple[list[tuple[int, str]], list[int]]:
        """Splits the messages a reply names into those it cannot answer, each with the reason, and those it can: a message written in a window is answered there, and one the agent answered already is added to by comment."""
        skipped, answerable = [], []
        for number in numbers:
            message = self.peek(number)
            kind, _, place = message.data.get("window", "").partition(":")
            earlier = next((reply for reply in self.comments(number) if self.actor == AGENT and reply.author == AGENT), None)
            if hasattr(CONTROLLERS.get(kind), "say"):
                skipped.append((number, f"message {number} was written in {kind} {place}: answer it there, with journal {kind} say {place}"))
            elif earlier:
                skipped.append((number, f"you already answered this in comment {earlier.n}: add to that answer with journal comment update {earlier.n} rather than a second reply"))
            else:
                answerable.append(number)
        return skipped, answerable

    def already_posted(self, text: str) -> Resource | None:
        """The very words already in the chat from this author, as a plain message or as a reply made moments ago, so a turn written twice is posted once. A reply keeps the message it answers quoted above it, so both are compared on what was actually typed."""
        words = unquoted(text.strip())
        if not words:
            return None
        since = time.time() - SAID_JUST_NOW
        mine = [*self.lately(since), *Comments(self.record, actor=self.actor).lately(since)]
        return next((r for r in mine if r.author == self.actor and unquoted((r.brief or r.title).strip()) == words), None)

    def _quoted(self, n: int) -> str:
        lines = (self.load(n).brief or self.load(n).title).strip().split("\n")
        while lines and (lines[0].startswith(">") or not lines[0].strip()):
            lines.pop(0)
        body = "\n".join(lines).strip()
        return f"> {body.replace(chr(10), chr(10) + '> ')}" if body else ""

    @action
    def edit(self, n: int, text: str):
        r = self.load(n)
        if AGENT in r.seen and self.actor != AGENT:
            self._refuse(f"message {n} has been read: leave a new one")
        return self.update(n, brief=text)

    @action
    def declare(self, n: int, kind: str):
        return self.update(n, kind=kind)
