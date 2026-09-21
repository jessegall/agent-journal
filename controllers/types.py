import base64
import subprocess
import tempfile
import time
from pathlib import Path

from controllers.base import Controller
from engine import attic
from engine.record import Record
from engine.sessions import Sessions
from resources import types
from resources.base import AGENT, SECTION, SYSTEM, Refused, check_title, names, titled
from resources.shapes import LEVELS
from engine.stored import read_json

UPLOAD = names("name", "data")


class Messages(Controller):
    resource = types.Message

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        with self.record.locked():
            key = data.get(types.Message.idempotency, "")
            if key:
                existing = next((message for message in self.all(deleted=True) if message.idempotency == key), None)
                if existing:
                    return existing
            return super().create(title, abstract, brief, **data)

    def update(self, n: int, title: str | None = None, abstract: str | None = None, brief: str | None = None, outcome: str | None = None, **data):
        return super().update(n, titled(brief) if title is None and brief is not None else title, abstract, brief, outcome, **data)

    def waiting(self) -> list:
        return [m for m in self.all() if not m.completed and m.seen[:1] != [AGENT]]

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

    def process(self, n: int, part: str, became: str):
        r = self.load(n)
        if part not in r.title and part not in r.brief:
            raise Refused(f"that part is not in message {n}; quote the words it is about")
        for kind, _, num in (w.strip().replace(" ", ":").partition(":") for w in became.split(",")):
            if kind in CONTROLLERS and num.isdigit():
                self.link(n, f"{kind}:{int(num)}")
        return self.section(n, part, became)

    def reply(self, n: int, text: str, file: str = ""):
        lines = (self.load(n).brief or self.load(n).title).strip().split("\n")
        while lines and (lines[0].startswith(">") or not lines[0].strip()):
            lines.pop(0)
        said = "\n".join(lines).strip()
        made = self.comment(n, f"> {said.replace(chr(10), chr(10) + '> ')}\n\n{text}" if said and not text.startswith(">") else text)
        if file:
            Comments(self.record, actor=self.actor).attach(made.n, file)
        return made

    def edit(self, n: int, text: str):
        r = self.load(n)
        if AGENT in r.seen and self.actor != AGENT:
            self.refuse(f"message {n} has been read: leave a new one")
        return self.update(n, brief=text)

    def declare(self, n: int, kind: str):
        return self.update(n, kind=kind)



class Todos(Controller):
    resource = types.Todo

    def assign(self, n: int, to: str = "", off: bool = False):
        if not to and not off:
            raise Refused("assign names an agent with --to, or --off to put the row back")
        return self.update(n, assigned="" if off else to)

    def report(self, n: int, how: str):
        if not self.agent:
            raise Refused("report is a subagent's word — the dispatcher closes a row with done")
        return self.update(n, reported={"agent": self.agent, "dispatcher": self.session, "how": how, "at": time.time()})

    def ask(self, n: int, question: str, **data):
        row = self.load(n)
        return Questions(self.record, actor=self.actor).create(question, about=row.ref, **data)

    def answer(self, n: int, text: str):
        questions = Questions(self.record, actor=self.actor)
        row = self.load(n)
        for q in questions.linked_to(row.ref):
            if not q.completed:
                return questions.complete(q.n, text)
        raise Refused(f"todo {n} has no open question")

    def block(self, n: int, why: str):
        return self.update(n, blocked=why)

    def unblock(self, n: int):
        return self.update(n, blocked="")

    def after(self, n: int, waits: str, off: bool = False):
        row = self.load(n)
        kind, _, num = (str(waits) if ":" in str(waits) else f"todo:{waits}").partition(":")
        if not self.waitable(kind) or not num.isdigit():
            raise Refused("a to-do waits on another to-do or a plan: a number, todo:<n> or plan:<n>")
        ref = self.waitable(kind)(self.record, actor=SYSTEM).load(int(num)).ref
        if ref == row.ref or row.ref in self.chain(ref):
            raise Refused(f"todo {n} waiting on {ref} would wait on itself")
        held = list(row.after or [])
        return self.update(n, after=[r for r in held if r != ref] if off else held + [ref] * (ref not in held))

    def waitable(self, kind: str):
        return {"todo": Todos, "plan": CONTROLLERS.get("plan")}.get(kind)

    def chain(self, ref: str) -> set[str]:
        seen, todo = set(), [ref]
        while todo:
            kind, _, num = todo.pop().partition(":")
            if kind != "todo" or f"todo:{num}" in seen:
                continue
            seen.add(f"todo:{num}")
            todo.extend(self.load(int(num)).after or [])
        return seen

    def waits(self, row) -> list[str]:
        open_ = []
        for ref in row.after or []:
            kind, _, num = ref.partition(":")
            try:
                other = self.waitable(kind)(self.record, actor=SYSTEM).load(int(num))
            except (TypeError, ValueError, Refused):
                continue
            finished = other.status in ENDED if kind == "plan" else other.completed
            if not finished and not other.deleted:
                open_.append(ref)
        return open_

    def mark(self, r) -> str:
        if r.type != self.type:
            return ""
        if r.completed:
            return "  [done]"
        if r.blocked:
            return f"  [blocked: {r.blocked}]"
        waits = self.waits(r)
        return f"  [waits on {', '.join(w.replace(':', ' ') for w in waits)}]" if waits else ""

    def strike(self, n: int, why: str):
        return self.complete(n, f"struck: {why}", struck=True)

    def start(self, n: int):
        from support.plans import held
        row = self.load(n)
        if held(self.record, row):
            self.refuse(f"todo {n} is not in the active plan's current phase: finish the plan, raise it to critical, or --force \"<why>\"")
            row = self.save(row, "updated", forced=True)
        return Works(self.record, actor=self.actor, session=self.session, agent=self.agent).create(row.title, brief=row.brief, todo=row.n)

    def prune(self, days: int = 30):
        cut = time.time() - int(days) * 86400
        gone = [r for r in self.all() if r.completed and r.completed < cut]
        for r in gone:
            self.delete(r.n, f"pruned after {days} days")
        return gone

    def priority(self, n: int, value: str):
        level = str(value).lower()
        if level not in LEVELS and not level.lstrip("-").isdigit():
            raise Refused(f"a priority is a number or one of {', '.join(LEVELS)}")
        return self.update(n, priority=LEVELS.get(level, int(level) if level.lstrip("-").isdigit() else 0))

    def all(self, deleted: bool = False) -> list:
        return sorted(super().all(deleted), key=lambda t: (-int(t.priority or LEVELS["default"]), t.n))


class Works(Controller):
    resource = types.Work

    def active(self):
        return next((w for w in self.all() if not w.completed and not w.parked), None)

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        busy = self.active()
        if busy:
            self.refuse(f'work {busy.n} is open: end it with journal work end --how "<what landed>", '
                          f'or set it aside with journal work park "<why>", before starting another')
        if data.get(types.Work.todo):
            row = Todos(self.record, actor=self.actor).load(int(data[types.Work.todo]))
            if row.completed:
                self.refuse(f"todo {row.n} is already done")
            held = row.assigned or ""
            if held and held != self.agent:
                self.refuse(f"todo {row.n} is assigned to {held}; nobody else may take it")
        return super().create(title, abstract, brief, **data)


class Docs(Controller):
    resource = types.Doc

    def draft(self, n: int):
        return self.update(n, status="draft")

    def complete(self, n: int, how: str = "", **data):
        self.update(n, status="final")
        return super().complete(n, how or "final", **data)

    def supersede(self, n: int, by: int):
        newer = self.load(int(by))
        self.complete(n, how=f"superseded by doc {newer.n}")
        self.link(n, newer.ref)
        return self.link(newer.n, self.load(n).ref)


class Reports(Controller):
    resource = types.Report

    def doc(self, n: int):
        r = self.load(n)
        docs = Docs(self.record, actor=self.actor)
        made = docs.create(r.title, r.abstract, r.brief, **r.data)
        for s in r.sections:
            made = docs.section(made.n, s[SECTION.title], s[SECTION.body])
        self.complete(n, how=f"became doc {made.n}")
        return made


class Pins(Controller):
    resource = types.Pin

    def promote(self, n: int):
        pin = self.load(n)
        rule = Rules(self.record, actor=self.actor).create(pin.title, pin.abstract, pin.brief, **pin.data)
        self.complete(n, how=f"promoted to rule {rule.n}")
        return rule


class Rules(Controller):
    resource = types.Rule

    def inject(self, n: int):
        return self.update(n, injected=True)

    def uninject(self, n: int):
        return self.update(n, injected=False)

    def pin(self, n: int):
        rule = self.load(n)
        notices = Notices(self.record, actor=self.actor)
        standing = [notice for notice in notices.linked_to(rule.ref) if not notice.completed]
        return standing[0] if standing else notices.create(rule.title, about=rule.ref, link=f"#/{self.record.env}/rule/{n}", label="Open rule")

class Reminders(Controller):
    resource = types.Reminder

    def create(self, title: str, abstract: str = "", brief: str = "", until: str = "", **data):
        return super().create(title, abstract, brief, until=until, **data)


class Questions(Controller):
    resource = types.Question


ACCEPT, ADJUST, DECLINE = "Accept", "Adjust", "Decline"
OPEN_SUGGESTIONS = 5


class Suggestions(Controller):
    resource = types.Suggestion

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        waiting = [s for s in self.all() if not s.completed]
        if len(waiting) >= OPEN_SUGGESTIONS:
            self.refuse(f"{OPEN_SUGGESTIONS} suggestions already wait on the user: {', '.join(str(s.n) for s in waiting)}")
        declined = [s for s in self.all() if s.decision == DECLINE.lower() and s.title.lower() == title.lower()]
        if declined and not data.pop("despite", None):
            s = declined[-1]
            self.refuse(f"suggestion {s.n} was declined{': ' + s.outcome if s.outcome else ''}; --set despite=true --set because=\"<what changed>\" to propose it again")
        options = [{"title": ACCEPT, "description": "a to-do is filed from it", "code": ""},
                   {"title": ADJUST, "description": "say what to do differently below; a to-do is filed from your words", "code": ""},
                   {"title": DECLINE, "description": "it is not proposed again", "code": ""}]
        return super().create(title, abstract, brief, options=options, **data)

    def complete(self, n: int, how: str = "", **data):
        word = how.strip().split(":", 1)[0].strip().lower()
        decision = word if word in (ACCEPT.lower(), DECLINE.lower()) else ADJUST.lower() if how.strip() else ""
        self.update(n, decision=decision)
        return super().complete(n, how, **data)

class Comments(Controller):
    resource = types.Comment


class Agents(Controller):
    resource = types.AgentRow

    def by_session(self, session: str):
        for r in self.all():
            if r.title == session:
                return r
        return self.create(session, status="stopped")

    def saw(self, n: int, fact: dict, **data):
        r = self.load(n)
        r.data.update(self._shaped(data))
        return self.save(r, "updated", **fact)

    def primary(self):
        rows = [row for row in self.all() if not row.parent]
        return max(rows, key=lambda row: float(row.at or 0), default=None)


class Notifications(Controller):
    resource = types.Notification


class Notices(Controller):
    resource = types.Notice


class Reactions(Controller):
    resource = types.Reaction


class Tools(Controller):
    resource = types.Tool

    def run(self, n: int, *args: str):
        tool = self.load(n)
        project = self.record.root.parent
        done = subprocess.run([*tool.entry.split(), *args], cwd=project, capture_output=True, text=True, timeout=600)
        return {"code": done.returncode, "out": done.stdout, "err": done.stderr}


class Connections(Controller):
    resource = types.Connection


class Plugins(Controller):
    resource = types.Plugin


class Environments(Controller):
    resource = types.Environment
    OPEN_BEFORE_REMOVING = (Todos, Pins, Reminders, Messages, Questions)
    PICKED_UP = (Works, Todos, Questions, Messages)

    def unused(self, name: str, hint: str = "") -> str:
        if any(e.title == name for e in self.all()):
            raise Refused(f"environment {name!r} exists{hint}")
        return name

    def vacant(self, title: str, mine: str = "") -> None:
        holder = Sessions(self.record.root).holder(title)
        if holder and holder != mine:
            self.refuse(f"environment {title!r} is held by session {holder}; it leaves first")

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        name = self.unused(check_title(title), ": switch to it")
        made = super().create(name, abstract, brief, **data)
        Record(self.record.root, name)
        return made

    def sessions(self) -> Sessions:
        if not self.session:
            raise Refused("no session to bind: say which with --session")
        return Sessions(self.record.root)

    def switch(self, n: int, project: bool = False, move: str = "", back: bool = False):
        who = move or self.session
        if back:
            was = self.sessions().read(who).get("before", "")
            if not was:
                raise Refused("this session came from nowhere: no environment to go back to")
            return self.switch(self.find(was).n, move=who)
        env = self.load(n)
        holder = self.sessions().holder(env.title)
        if holder and holder != who:
            self.refuse(f"environment {env.title!r} is taken by session {holder}: claim it with a reason, or work another")
        before = self.sessions().environment(who)
        self.sessions().bind(who, env.title)
        if before and before != env.title:
            self.sessions().write(who, before=before)
        if project:
            f = self.record.root / "runtime" / "env"
            f.parent.mkdir(parents=True, exist_ok=True)
            f.write_text(env.title)
        return self.update(n, holder=who)

    def complete(self, n: int, how: str = "", yes: bool = False, **data):
        env = self.load(n)
        record = Record(self.record.root, env.title)
        held = {c.resource.type: len([r for r in c(record, actor=SYSTEM).all() if not r.completed]) for c in self.OPEN_BEFORE_REMOVING}
        self.vacant(env.title)
        kept = ", ".join(f"{v} open {k}s" for k, v in held.items() if v)
        if kept and not yes:
            self.refuse(f"environment {env.title!r} holds {kept}; --yes removes it anyway (its record goes to the attic)")
        if record.home.is_dir():
            attic.pack(record.home, f"{env.title}-{int(time.time())}")
        self.force_delete(n)
        return f"environment {env.title!r} removed; its record is packed in attic/ — journal environment unarchive {env.title} brings it back"

    def unarchive(self, name: str):
        archive = attic.latest(self.record.root, name)
        if not archive:
            raise Refused(f"no archived environment {name!r} in attic/")
        self.unused(name, ": rename it before bringing the archived one back")
        attic.unpack(archive, Record(self.record.root, name).home)
        return self.create(name)

    def rename(self, n: int, name: str):
        env = self.load(n)
        new = self.unused(check_title(name))
        self.vacant(env.title, self.session)
        old = Record(self.record.root, env.title).home
        if old.is_dir():
            old.rename(old.with_name(new))
        Sessions(self.record.root).rebind(env.title, new)
        return self.update(n, title=new)

    def pickup(self, n: int) -> dict:
        env = self.load(n)
        record = Record(self.record.root, env.title)
        return {"environment": env.title, "holder": self.sessions().holder(env.title),
                **{f"open {c.resource.type}s": [f"{r.n} {r.title}" for r in c(record, actor=SYSTEM).all() if not r.completed][:10] for c in self.PICKED_UP},
                "pins": [f"{r.n} {r.title}" for r in Pins(record, actor=SYSTEM).all() if not r.completed][:10]}

    def claim(self, n: int, why: str):
        env = self.load(n)
        holder = self.sessions().holder(env.title)
        if holder and holder != self.session:
            self.sessions().evict(holder, self.session, env.title, why)
        self.sessions().bind(self.session, env.title)
        return self.update(n, holder=self.session, claimed={"from": holder, "why": why})

    def leave(self, n: int):
        self.sessions().unbind(self.session)
        return self.update(n, holder="")

    def grant(self, n: int, off: bool = False):
        env = self.load(n)
        return self.sessions().grant(self.session, env.title, on=not off)


OPS = ("shot", "url", "text", "dom", "console", "click", "type", "goto", "eval", "scroll")


def driver_file(root: Path, env: str) -> Path:
    return root / "runtime" / f"browser-{env}.json"


class Asks(Controller):
    resource = types.Ask

    def driving(self) -> dict:
        return read_json(driver_file(self.record.root, self.record.env), {})

    def ask(self, op: str, *args: str, wait: int = 30):
        if op not in OPS:
            raise Refused(f"an ask is one of {' '.join(OPS)}")
        tab = self.driving()
        if not tab.get("on"):
            raise Refused("no tab is being driven: the user turns driving on in the chat window's bar (the wheel)")
        made = self.create(f"browser {op}", brief=" ".join(args), op=op, args=list(args))
        end = time.time() + int(wait)
        while time.time() < end:
            got = self.load(made.n)
            if got.completed:
                return got
            time.sleep(0.4)
        return self.load(made.n)

    def pending(self) -> list:
        return [r for r in self.all() if not r.completed]

    def answer(self, n: int, text: str, ok: bool = True, files: list | None = None):
        r = self.complete(n, text, ok=ok)
        for f in files or []:
            with tempfile.TemporaryDirectory() as folder:
                path = Path(folder) / Path(f[UPLOAD.name]).name
                path.write_bytes(base64.b64decode(f[UPLOAD.data].split(",", 1)[-1]))
                self.attach(n, str(path))
        return self.load(n)


class Nudges(Controller):
    resource = types.Nudge


def register(*classes) -> None:
    CONTROLLERS.update({c.resource.type: c for c in classes})


CONTROLLERS = {c.resource.type: c for c in (Messages, Todos, Works, Docs, Reports, Pins, Rules, Reminders, Suggestions,
                                            Questions, Comments, Agents, Notifications, Notices, Reactions, Tools, Connections, Plugins, Environments, Asks, Nudges)}
