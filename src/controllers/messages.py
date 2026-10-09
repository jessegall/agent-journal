from controllers.base import Controller, CONTROLLERS
from resources import types
from resources.base import AGENT, SYSTEM, USER, Refused, Resource, titled
from controllers.comments import Comments
from controllers.marks import action


def only_emoji(text: str) -> bool:
    kept = "".join(ch for ch in text if not ch.isspace())
    return bool(kept) and not any(ch.isalnum() or ch in ".,;:!?-_'\"()[]<>/@#" for ch in kept) and any(ord(ch) > 0x2000 for ch in kept)


class Messages(Controller):
    resource = types.Message

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
        r = self.load(n)
        if part not in r.title and part not in r.brief:
            raise Refused(f"that part is not in message {n}; quote the words it is about")
        for kind, _, num in (w.strip().replace(" ", ":").partition(":") for w in result.split(",")):
            if kind in CONTROLLERS and num.isdigit():
                self.link(n, f"{kind}:{int(num)}")
        return self.section(n, part, result)

    def _closed_once(self, n: int, how: str) -> Resource | None:
        """Closes a message unless it is closed already, whoever got there first, so a second handler or thread asking is no failure."""
        with self.record.locked(self.resource.scope):
            return None if self.load(n).completed else self.complete(n, how)

    @action
    def reply(self, n: str, text: str, file: str = ""):
        numbers = [int(part) for part in str(n).replace(",", " ").split()]
        if not numbers:
            self._refuse("name the message to reply to: journal message reply <n> \"<text>\", or several as 12,13")
        if only_emoji(text):
            self._refuse(f"a reply that is only {text.strip()} is a reaction: journal message react {numbers[0]} \"{text.strip()}\"")
        unread = [number for number in numbers if self.actor == AGENT and AGENT not in self.load(number).seen]
        if unread:
            self._refuse(f"read message {unread[0]} before you answer it: journal message read {unread[0]}")
        windowed = next((m for m in map(self.load, numbers) if hasattr(CONTROLLERS.get(m.data.get("window", "").partition(":")[0]), "say")), None)
        if windowed:
            kind, _, place = windowed.data["window"].partition(":")
            self._refuse(f"message {windowed.n} was written in {kind} {place}: answer it there, with journal {kind} say {place}")
        earlier = next((reply for number in numbers for reply in self.comments(number) if self.actor == AGENT and reply.author == AGENT), None)
        if earlier:
            self._refuse(f"you already answered this in comment {earlier.n}: add to that answer with journal comment update {earlier.n} rather than a second reply")
        quotes = [self._quoted(number) for number in numbers]
        quoted = "\n>\n".join(quote for quote in quotes if quote)
        made = self.comment(numbers[0], f"{quoted}\n\n{text}" if quoted and not text.startswith(">") else text)
        for number in numbers[1:]:
            Comments(self.record, actor=self.actor).link(made.n, f"message:{number}")
            self._mark_commented(number, made)
        if file:
            Comments(self.record, actor=self.actor).attach(made.n, file)
        return made

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
