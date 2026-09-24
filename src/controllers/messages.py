from controllers.base import Controller, CONTROLLERS
from resources import types
from resources.base import AGENT, Refused, titled
from controllers.comments import Comments


def only_emoji(text: str) -> bool:
    kept = "".join(ch for ch in text if not ch.isspace())
    return bool(kept) and not any(ch.isalnum() or ch in ".,;:!?-_'\"()[]<>/@#" for ch in kept) and any(ord(ch) > 0x2000 for ch in kept)


class Messages(Controller):
    resource = types.Message

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        with self.record.locked():
            key = data.get(types.Message.idempotency, "")
            if key:
                existing = next((row["n"] for row in self.summaries() if row.get(types.Message.idempotency) == key), None)
                if existing:
                    return self.load(existing)
            return super().create(title, abstract, brief, **data)

    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data):
        return super().update(n, titled(brief) if title is None and brief is not None else title, abstract, brief, outcome, **data)

    def waiting(self) -> list:
        return [m for m in self._standing() if m.seen[:1] != [AGENT]]

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

    def archive(self, n: int, why: str):
        return self.delete(n, why)

    def process(self, n: int, part: str, result: str):
        r = self.load(n)
        if part not in r.title and part not in r.brief:
            raise Refused(f"that part is not in message {n}; quote the words it is about")
        for kind, _, num in (w.strip().replace(" ", ":").partition(":") for w in result.split(",")):
            if kind in CONTROLLERS and num.isdigit():
                self.link(n, f"{kind}:{int(num)}")
        return self.section(n, part, result)

    def reply(self, n: str, text: str, file: str = ""):
        numbers = [int(part) for part in str(n).replace(",", " ").split()]
        if not numbers:
            self._refuse("name the message to reply to: journal message reply <n> \"<text>\", or several as 12,13")
        if only_emoji(text):
            self._refuse(f"a reply that is only {text.strip()} is a reaction: journal message react {numbers[0]} \"{text.strip()}\"")
        quotes = [self._quoted(number) for number in numbers]
        quoted = "\n>\n".join(quote for quote in quotes if quote)
        made = self.comment(numbers[0], f"{quoted}\n\n{text}" if quoted and not text.startswith(">") else text)
        for number in numbers[1:]:
            Comments(self.record, actor=self.actor).link(made.n, f"message:{number}")
            self.save(self.load(number), "commented", comment=made.n)
        if file:
            Comments(self.record, actor=self.actor).attach(made.n, file)
        return made

    def _quoted(self, n: int) -> str:
        lines = (self.load(n).brief or self.load(n).title).strip().split("\n")
        while lines and (lines[0].startswith(">") or not lines[0].strip()):
            lines.pop(0)
        body = "\n".join(lines).strip()
        return f"> {body.replace(chr(10), chr(10) + '> ')}" if body else ""

    def edit(self, n: int, text: str):
        r = self.load(n)
        if AGENT in r.seen and self.actor != AGENT:
            self._refuse(f"message {n} has been read: leave a new one")
        return self.update(n, brief=text)

    def declare(self, n: int, kind: str):
        return self.update(n, kind=kind)
