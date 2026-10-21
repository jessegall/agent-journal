import json
import time

from journal.support.actor import Actor
from journal.support.actor_kind import ActorKind
from journal.models.author import Author
from journal.models.dump import Dump
from journal.models.link import Link
from journal.models.message import Message
from journal.support.ref import Ref
from journal.support.rejection import Rejection
from journal.repositories.docs import Docs
from journal.repositories.dumps import Dumps
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.plans import Plans
from journal.repositories.reports import Reports
from journal.repositories.tasks import Tasks

LABEL = 40
DUMP_LOG_LENGTH = 20
ANSWER = 600
OFFERED = 4
USER_TEXT = -2
FILED = "dump_filed"
TABLES = {"doc": "docs", "report": "reports", "todo": "tasks", "task": "tasks", "plan": "plans", "fact": "facts", "rule": "rules", "reminder": "reminders"}


class DumpFiler:
    """What is done to a dump: the agent's notes on its items and the user's choices on it. The command and the viewer both come here."""

    def __init__(self, dumps: Dumps, links: Links, messages: Messages, docs: Docs, reports: Reports, tasks: Tasks, plans: Plans) -> None:
        self.dumps, self.links, self.messages = dumps, links, messages
        self.removable = {"docs": docs, "reports": reports, "tasks": tasks, "plans": plans}

    def create(self, brief: str, actor: Actor) -> Dump:
        dump = self.dumps.save(Dump(title="Dump", brief=brief.strip(), queued_at=time.time()), actor)
        return self.dumps.save(dump.with_(title=f"Dump {dump.id}").arrived(time.time(), actor.is_user()), actor)

    def attach(self, n: int, name: str, actor: Actor) -> Dump:
        dump = self.open(n, f"dump {n} is already filed: start a new dump for more")
        return self.dumps.save(dump.with_(files=tuple(dict.fromkeys((*dump.files, name)))).arrived(time.time(), actor.is_user()), actor)

    def items(self, n: int) -> list[str]:
        dump = self.dumps.find(n)
        return [f"{name}: {dump.item(name).data}" for name in dump.item_names]

    def note(self, n: int, item: str, insight: str, actor: Actor) -> Dump:
        return self.written(n, item, actor, insight=insight.strip())

    def filed(self, n: int, item: str, how: str, refs: str, added: str, actor: Actor) -> Dump:
        if not how.strip():
            raise Rejection("say what was done with it")
        rows, own = self.refs(refs), self.refs(added)
        if set(own) - set(rows):
            raise Rejection("--added names rows you also list in refs")
        dump = self.dumps.find(n)
        missing = [ref for ref in rows if not self.links.is_row(Ref.parse(ref))]
        if missing:
            raise Rejection(f"not a row here: {', '.join(missing)}")
        for ref in rows:
            self.links.save(Link(source=Ref.to(dump), target=Ref.parse(ref), kind=FILED), actor)
        return self.written(n, item, actor, outcome=how.strip(), refs=rows, added=own, failed="")

    def failed(self, n: int, item: str, why: str, actor: Actor) -> Dump:
        if not why.strip():
            raise Rejection("say why it could not be filed")
        return self.written(n, item, actor, failed=why.strip())

    def written(self, n: int, item: str, actor: Actor, **values) -> Dump:
        dump = self.dumps.find(n)
        if item not in dump.item_names:
            raise Rejection(f"dump {n} has no item {item!r}; its items are {', '.join(dump.item_names) or 'none yet'}")
        written = self.dumps.save(dump.with_item(item, **values), actor)
        if written.is_completed or not written.is_complete:
            return written
        failed = sum(bool(written.item(name).failed) for name in written.item_names)
        return self.close(written, f"{len(written.item_names) - failed} filed" + (f", {failed} failed" if failed else ""), actor)

    def close(self, dump: Dump, how: str, actor: Actor) -> Dump:
        return self.dumps.save(dump.filed(how, time.time()), actor)

    def log(self, n: int, status: str, on: str, making: str, detail: str, actor: Actor) -> Dump:
        dump = self.dumps.find(n)
        if not status.strip():
            raise Rejection("say what you are doing")
        if len(status.strip()) > LABEL:
            raise Rejection(f"a status is a short title of at most {LABEL} characters, like Adding files; the sentence goes in --detail")
        if dump.is_completed and not dump.options and not dump.chosen:
            raise Rejection(f"dump {n} is closed")
        return self.dumps.save(dump.logged(self.entry(status, on=on, making=making, detail=detail), DUMP_LOG_LENGTH), actor)

    def say(self, n: int, text: str, actor: Actor) -> Dump:
        if not text.strip():
            raise Rejection('say the answer: journal dump say <n> "<text>"')
        if len(text.strip()) > ANSWER:
            raise Rejection(f"an answer in the dump is at most {ANSWER} characters; this one is {len(text.strip())}")
        return self.dumps.save(self.dumps.find(n).logged(self.entry(text, answer=True), DUMP_LOG_LENGTH), actor)

    def ask(self, n: int, question: str, guesses: str, actor: Actor) -> Dump:
        if not question.strip():
            raise Rejection("say what you need to know")
        dump = self.open(n, f"dump {n} is closed")
        rows = [g.strip()[:LABEL] for g in guesses.split("|") if g.strip()][:OFFERED]
        return self.dumps.save(dump.posed_question(question.strip(), rows, time.time()), actor)

    def answer(self, n: int, text: str, actor: Actor) -> Dump:
        self.only_user(actor, "answers a question on a dump")
        dump = self.dumps.find(n)
        if not dump.question:
            raise Rejection(f"dump {n} has no question waiting")
        if not text.strip():
            raise Rejection("say the answer")
        return self.dumps.save(dump.answered(text.strip(), time.time()), actor)

    def split(self, n: int, parts: str, actor: Actor) -> Dump:
        dump = self.dumps.find(n)
        if not dump.brief.strip():
            raise Rejection(f"dump {n} has no pasted text to split")
        rows = list(dict.fromkeys(part.strip()[:LABEL] for part in parts.split(",") if part.strip()))
        if not rows or set(rows) & set(dump.files):
            raise Rejection("name the parts of the pasted text, comma separated, none named like a dropped file")
        return self.dumps.save(dump.with_(parts=tuple(rows)), actor)

    def name(self, n: int, title: str, actor: Actor) -> Dump:
        if not title.strip():
            raise Rejection("say the name")
        return self.dumps.save(self.dumps.find(n).with_(title=title.strip()), actor)

    def dismiss(self, n: int, actor: Actor) -> Dump:
        return self.dumps.save(self.dumps.find(n).with_(dismissed=True), actor)

    def offer(self, n: int, options: str, summary: str, actor: Actor) -> Dump:
        try:
            offered = json.loads(options or "[]")
        except ValueError as error:
            raise Rejection("options is a JSON list of {ask, label}") from error
        steps = [{"label": str(o.get("label", "")).strip(), "ask": str(o.get("ask", "")).strip()} for o in (offered[:OFFERED] if isinstance(offered, list) else []) if isinstance(o, dict)]
        steps = [step for step in steps if step["label"]]
        if not steps and not summary.strip():
            raise Rejection("sum up what you filed with --summary, and offer a next step only where one is worth taking")
        return self.dumps.save(self.dumps.find(n).with_(options=tuple(steps), chosen={}, taken={}, declined=(), summary=summary.strip()), actor)

    def choose(self, n: int, pick: int, actor: Actor) -> Dump:
        self.only_user(actor, "chooses what a dump does next")
        dump = self.dumps.find(n)
        if pick >= len(dump.options):
            raise Rejection(f"dump {n} has no option {pick}: pick is the number of an offered step, or -1 for You decide")
        if str(pick) in dump.taken:
            raise Rejection(f"{dump.options[pick]['label']} was already taken on dump {n}")
        return self.dumps.save(dump.step_chosen(pick, dump.options[pick]["label"] if pick >= 0 else "You decide", time.time()), actor)

    def decline(self, n: int, pick: int, actor: Actor) -> Dump:
        self.only_user(actor, "chooses what a dump does next")
        dump = self.dumps.find(n)
        if not 0 <= pick < len(dump.options):
            raise Rejection(f"dump {n} has no option {pick}: pick is the number of an offered step")
        return self.dumps.save(dump.with_(declined=tuple(sorted({*dump.declined, pick}))), actor)

    def direct(self, n: int, how: str, actor: Actor) -> Dump:
        self.only_user(actor, "chooses what a dump does next")
        if not how.strip():
            raise Rejection('say what should happen next: journal dump direct <n> "<what to do>"')
        dump = self.dumps.find(n)
        message = self.messages.save(Message(author=Author.USER, text=how.strip()).arrived(), actor)
        self.links.save(Link(source=Ref.to(message), target=Ref.to(dump), kind=Messages.COMMENT_LINK), actor)
        return self.dumps.save(dump.step_directed(how.strip(), time.time()), actor)

    def stop(self, n: int, actor: Actor) -> Dump:
        self.only_user(actor, "stops a dump")
        dump = self.dumps.find(n)
        if dump.is_completed:
            raise Rejection(f"dump {n} is already closed")
        filed = sum(1 for name in dump.item_names if dump.item(name).outcome)
        return self.close(dump.with_(stopped=True), f"stopped, {filed} filed, {len(dump.item_names) - filed} left out", actor)

    def reopen(self, n: int, actor: Actor) -> Dump:
        return self.dumps.save(self.dumps.find(n).with_(completed_at=0.0, outcome="", stopped=False, queued_at=time.time()), actor)

    def remove(self, n: int, actor: Actor) -> Dump:
        self.only_user(actor, "removes what a dump filed")
        dump = self.dumps.find(n)
        if dump.removed_at:
            raise Rejection(f"dump {n} was already removed")
        if not dump.is_completed:
            dump = self.stop(n, actor)
        gone = [ref for ref in dump.created_refs() if self.deleted(Ref.parse(ref), dump, actor)]
        return self.dumps.save(dump.with_(removed_at=time.time(), removed_refs=tuple(gone)), actor)

    def deleted(self, ref: Ref, dump: Dump, actor: Actor) -> bool:
        repository = self.removable.get(ref.type)
        if repository is None or not self.links.is_row(ref):
            return False
        row = repository.find(ref.id)
        if row.created_at < dump.created_at:
            return False
        repository.delete(row, actor)
        return True

    def open(self, n: int, closed: str) -> Dump:
        dump = self.dumps.find(n)
        if dump.is_completed:
            raise Rejection(closed)
        return dump

    @staticmethod
    def only_user(actor: Actor, what: str) -> None:
        if actor.kind == ActorKind.AGENT:
            raise Rejection(f"only the user {what}")

    @staticmethod
    def entry(text: str, on: str = "", making: str = "", detail: str = "", **extra) -> dict:
        return {"time": time.time(), "text": text.strip(), "on": on.strip(), "making": making.strip(), "detail": detail.strip(), **extra}

    @staticmethod
    def refs(text: str) -> list[str]:
        refs = []
        for part in (p.strip() for p in text.split(",") if p.strip()):
            kind, _, number = part.partition(":")
            if not number.isdigit():
                raise Rejection(f"not a row: {part}; write each as doc:2 or plans:8")
            table = TABLES.get(kind, kind)
            if table not in TABLES.values():
                raise Rejection(f"not a row a dump files into: {part}; write each as doc:2 or plans:8")
            refs.append(f"{table}:{number}")
        return refs
