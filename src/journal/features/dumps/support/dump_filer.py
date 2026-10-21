import json
import time

from journal.support.actor import Actor
from journal.support.actor_kind import ActorKind
from journal.models.author import Author
from journal.models.dump import Dump
from journal.models.link import Link
from journal.models.message import Message
from journal.models.support.ref import Ref
from journal.support.rejection import Rejection
from journal.repositories.docs import Docs
from journal.repositories.dumps import Dumps
from journal.repositories.links import Links
from journal.repositories.messages import Messages
from journal.repositories.plans import Plans
from journal.repositories.reports import Reports
from journal.repositories.rows import Rows
from journal.repositories.tasks import Tasks

LABEL_CHARACTERS = 40
DUMP_LOG_ENTRIES = 20
ANSWER_CHARACTERS = 600
GUESS_COUNT = 4
USER_TEXT = -2
FILED = "dump_filed"
TABLES = {"doc": "docs", "report": "reports", "todo": "tasks", "task": "tasks", "plan": "plans", "fact": "facts", "rule": "rules", "reminder": "reminders"}


class DumpFiler:
    """What is done to a dump: the agent's notes on its items and the user's choices on it. The command and the viewer both come here."""

    def __init__(self, dumps: Dumps, links: Links, messages: Messages, docs: Docs, reports: Reports, tasks: Tasks, plans: Plans, rows: Rows) -> None:
        self.dumps, self.links, self.messages, self.rows = dumps, links, messages, rows
        self.removable: dict[str, Docs | Reports | Tasks | Plans] = {"docs": docs, "reports": reports, "tasks": tasks, "plans": plans}

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
        return self.filed_item(n, item, actor, insight=insight.strip())

    def filed(self, n: int, item: str, manner: str, refs: str, added: str, actor: Actor) -> Dump:
        if not manner.strip():
            raise Rejection("say what was done with it")
        rows, owned = self.refs(refs), self.refs(added)
        if set(owned) - set(rows):
            raise Rejection("--added names rows you also list in refs")
        dump = self.dumps.find(n)
        missing = [ref for ref in rows if not self.rows.is_row(Ref.parse(ref))]
        if missing:
            raise Rejection(f"not a row here: {', '.join(missing)}")
        for ref in rows:
            self.links.save(Link(source=Ref.build(dump), target=Ref.parse(ref), kind=FILED), actor)
        return self.filed_item(n, item, actor, outcome=manner.strip(), refs=rows, added=owned, failed="")

    def failed(self, n: int, item: str, reason: str, actor: Actor) -> Dump:
        if not reason.strip():
            raise Rejection("say why it could not be filed")
        return self.filed_item(n, item, actor, failed=reason.strip())

    def filed_item(self, n: int, item: str, actor: Actor, **values) -> Dump:
        dump = self.dumps.find(n)
        if item not in dump.item_names:
            raise Rejection(f"dump {n} has no item {item!r}; its items are {', '.join(dump.item_names) or 'none yet'}")
        saved = self.dumps.save(dump.with_item(item, **values), actor)
        if saved.is_completed or not saved.is_complete:
            return saved
        failed = sum(bool(saved.item(name).failed) for name in saved.item_names)
        return self.close(saved, f"{len(saved.item_names) - failed} filed" + (f", {failed} failed" if failed else ""), actor)

    def close(self, dump: Dump, manner: str, actor: Actor) -> Dump:
        return self.dumps.save(dump.filed(manner, time.time()), actor)

    def log(self, n: int, status: str, enabled: str, making: str, detail: str, actor: Actor) -> Dump:
        dump = self.dumps.find(n)
        if not status.strip():
            raise Rejection("say what you are doing")
        if len(status.strip()) > LABEL_CHARACTERS:
            raise Rejection(f"a status is a short title of at most {LABEL_CHARACTERS} characters, like Adding files; the sentence goes in --detail")
        if dump.is_completed and not dump.options and not dump.choice:
            raise Rejection(f"dump {n} is closed")
        return self.dumps.save(dump.logged(self.entry(status, enabled=enabled, making=making, detail=detail), DUMP_LOG_ENTRIES), actor)

    def reply(self, n: int, text: str, actor: Actor) -> Dump:
        if not text.strip():
            raise Rejection('say the answer: journal dump reply <n> "<text>"')
        if len(text.strip()) > ANSWER_CHARACTERS:
            raise Rejection(f"an answer in the dump is at most {ANSWER_CHARACTERS} characters; this one is {len(text.strip())}")
        return self.dumps.save(self.dumps.find(n).logged(self.entry(text, answer=True), DUMP_LOG_ENTRIES), actor)

    def ask(self, n: int, question: str, guesses: str, actor: Actor) -> Dump:
        if not question.strip():
            raise Rejection("say what you need to know")
        dump = self.open(n, f"dump {n} is closed")
        rows = [g.strip()[:LABEL_CHARACTERS] for g in guesses.split("|") if g.strip()][:GUESS_COUNT]
        return self.dumps.save(dump.posed_question(question.strip(), rows, time.time()), actor)

    def answer(self, n: int, text: str, actor: Actor) -> Dump:
        self.require_user(actor, "answers a question on a dump")
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
        rows = list(dict.fromkeys(part.strip()[:LABEL_CHARACTERS] for part in parts.split(",") if part.strip()))
        if not rows or set(rows) & set(dump.files):
            raise Rejection("name the parts of the pasted text, comma separated, none named like a dropped file")
        return self.dumps.save(dump.with_(parts=tuple(rows)), actor)

    def name(self, n: int, title: str, actor: Actor) -> Dump:
        if not title.strip():
            raise Rejection("say the name")
        return self.dumps.save(self.dumps.find(n).with_(title=title.strip()), actor)

    def dismiss(self, n: int, actor: Actor) -> Dump:
        return self.dumps.save(self.dumps.find(n).with_(dismissed=True), actor)

    def propose(self, n: int, options: str, summary: str, actor: Actor) -> Dump:
        try:
            offered = json.loads(options or "[]")
        except ValueError as error:
            raise Rejection("options is a JSON list of {ask, label}") from error
        steps = [{"label": str(o.get("label", "")).strip(), "ask": str(o.get("ask", "")).strip()} for o in (offered[:GUESS_COUNT] if isinstance(offered, list) else []) if isinstance(o, dict)]
        steps = [step for step in steps if step["label"]]
        if not steps and not summary.strip():
            raise Rejection("sum up what you filed with --summary, and offer a next step only where one is worth taking")
        return self.dumps.save(self.dumps.find(n).with_(options=tuple(steps), choice={}, claimed={}, declined=(), summary=summary.strip()), actor)

    def choose(self, n: int, choice: int, actor: Actor) -> Dump:
        self.require_user(actor, "chooses what a dump does next")
        dump = self.dumps.find(n)
        if choice >= len(dump.options):
            raise Rejection(f"dump {n} has no option {choice}: pick is the number of an offered step, or -1 for You decide")
        if str(choice) in dump.claimed:
            raise Rejection(f"{dump.options[choice]['label']} was already taken on dump {n}")
        return self.dumps.save(dump.step_chosen(choice, dump.options[choice]["label"] if choice >= 0 else "You decide", time.time()), actor)

    def decline(self, n: int, choice: int, actor: Actor) -> Dump:
        self.require_user(actor, "chooses what a dump does next")
        dump = self.dumps.find(n)
        if not 0 <= choice < len(dump.options):
            raise Rejection(f"dump {n} has no option {choice}: pick is the number of an offered step")
        return self.dumps.save(dump.with_(declined=tuple(sorted({*dump.declined, choice}))), actor)

    def direct(self, n: int, manner: str, actor: Actor) -> Dump:
        self.require_user(actor, "chooses what a dump does next")
        if not manner.strip():
            raise Rejection('say what should happen next: journal dump direct <n> "<what to do>"')
        dump = self.dumps.find(n)
        message = self.messages.save(Message(author=Author.USER, text=manner.strip()).arrived(), actor)
        self.links.save(Link(source=Ref.build(message), target=Ref.build(dump), kind=Messages.COMMENT_LINK), actor)
        return self.dumps.save(dump.step_directed(manner.strip(), time.time()), actor)

    def stop(self, n: int, actor: Actor) -> Dump:
        self.require_user(actor, "stops a dump")
        dump = self.dumps.find(n)
        if dump.is_completed:
            raise Rejection(f"dump {n} is already closed")
        filed = sum(1 for name in dump.item_names if dump.item(name).outcome)
        return self.close(dump.with_(stopped=True), f"stopped, {filed} filed, {len(dump.item_names) - filed} left out", actor)

    def reopen(self, n: int, actor: Actor) -> Dump:
        return self.dumps.save(self.dumps.find(n).with_(completed_at=0.0, outcome="", stopped=False, queued_at=time.time()), actor)

    def remove(self, n: int, actor: Actor) -> Dump:
        self.require_user(actor, "removes what a dump filed")
        dump = self.dumps.find(n)
        if dump.removed_at:
            raise Rejection(f"dump {n} was already removed")
        if not dump.is_completed:
            dump = self.stop(n, actor)
        missing = [ref for ref in dump.created_refs() if self.deleted(Ref.parse(ref), dump, actor)]
        return self.dumps.save(dump.with_(removed_at=time.time(), removed_refs=tuple(missing)), actor)

    def deleted(self, ref: Ref, dump: Dump, actor: Actor) -> bool:
        repository = self.removable.get(ref.type)
        if repository is None or not self.rows.is_row(ref):
            return False
        if repository.find(ref.id).creation_time < dump.creation_time:
            return False
        repository.remove(ref.id, actor)
        return True

    def open(self, n: int, closed: str) -> Dump:
        dump = self.dumps.find(n)
        if dump.is_completed:
            raise Rejection(closed)
        return dump

    @staticmethod
    def require_user(actor: Actor, subject: str) -> None:
        if actor.kind == ActorKind.AGENT:
            raise Rejection(f"only the user {subject}")

    @staticmethod
    def entry(text: str, enabled: str = "", making: str = "", detail: str = "", **extra) -> dict:
        return {"time": time.time(), "text": text.strip(), "on": enabled.strip(), "making": making.strip(), "detail": detail.strip(), **extra}

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
