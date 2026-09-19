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
from resources.types import PHASE
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
            raise Refused(f"message {n} has been read: leave a new one")
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

    def after(self, n: int, waits: int, off: bool = False):
        other = self.load(int(waits))
        return self.unlink(n, other.ref) if off else self.link(n, other.ref)

    def strike(self, n: int, why: str):
        return self.complete(n, f"struck: {why}", struck=True)

    def start(self, n: int):
        row = self.load(n)
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

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        if data.get(types.Work.todo):
            row = Todos(self.record, actor=self.actor).load(int(data[types.Work.todo]))
            if row.completed:
                raise Refused(f"todo {row.n} is already done")
            held = row.assigned or ""
            if held and held != self.agent:
                raise Refused(f"todo {row.n} is assigned to {held}; nobody else may take it")
        return super().create(title, abstract, brief, **data)


DRAFT, READY, ACTIVE, WAITING, DONE, ABANDONED = "draft", "ready", "active", "waiting", "done", "abandoned"


class Plans(Controller):
    resource = types.Plan

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        return super().create(title, abstract, brief, status=DRAFT, phases=[], current=1, **data)

    def from_doc(self, doc: int):
        source = Docs(self.record, actor=self.actor).load(int(doc))
        plan = self.create(source.title, brief=source.brief, goal=source.abstract)
        for s in source.sections:
            if s[SECTION.title].lower().startswith("phase"):
                self.phase(plan.n, s[SECTION.title].split(":", 1)[-1].split("—", 1)[-1].strip() or s[SECTION.title], brief=s[SECTION.body])
        return self.link(plan.n, source.ref)

    def phases(self, n: int) -> list[dict]:
        return self.load(n).phases

    def phase(self, n: int, title: str, when: str = "", checkpoint: bool = False, brief: str = "", before: int = 0):
        r = self.load(n)
        made = {PHASE.title: check_title(title), PHASE.when: check_title(when) if when else "", PHASE.checkpoint: bool(checkpoint), PHASE.brief: brief, PHASE.todos: []}
        r.phases.insert(int(before) - 1 if before else len(r.phases), made)
        return self.save(r, "updated", phase=r.phases.index(made) + 1)

    def rephrase(self, n: int, p: int, title: str | None = None, when: str | None = None, checkpoint: bool | None = None, brief: str | None = None):
        r = self.load(n)
        phase = self._phase(r, p)
        for key, value in ((PHASE.title, title), (PHASE.when, when), (PHASE.checkpoint, checkpoint), (PHASE.brief, brief)):
            if value is not None:
                phase[key] = check_title(value) if key in (PHASE.title, PHASE.when) and value else value
        return self.save(r, "updated", phase=int(p))

    def place(self, n: int, p: int, todos: list, move: bool = False, off: bool = False):
        r = self.load(n)
        phase = self._phase(r, p)
        for t in (int(x) for x in todos):
            elsewhere = next((i + 1 for i, ph in enumerate(r.phases) if t in ph[PHASE.todos]), 0)
            if off:
                phase[PHASE.todos] = [x for x in phase[PHASE.todos] if x != t]
                continue
            if elsewhere and elsewhere != int(p) and not move:
                raise Refused(f"todo {t} already sits in phase {elsewhere} of plan {n}; --move takes it out of there")
            for ph in r.phases:
                ph[PHASE.todos] = [x for x in ph[PHASE.todos] if x != t]
            phase[PHASE.todos].append(t)
        for t in todos:
            ref = f"todo:{int(t)}"
            r.refs = [x for x in r.refs if x != ref] if off else r.refs + [ref] * (ref not in r.refs)
        return self.save(r, "linked", phase=int(p), todos=[int(t) for t in todos], off=off)

    def ready(self, n: int):
        r = self.load(n)
        for i, ph in enumerate(r.phases, 1):
            if not ph[PHASE.todos]:
                raise Refused(f"plan {n} cannot be ready: phase {i} has no to-dos")
        return self._status(r, READY, DRAFT)

    def activate(self, n: int):
        self._user_only("activate")
        r = self.load(n)
        if any(x.status in (ACTIVE, WAITING) for x in self.all() if x.n != n):
            raise Refused("one plan is active at a time on an environment")
        return self._status(r, ACTIVE, DRAFT, READY)

    def resume(self, n: int):
        self._user_only("continue")
        r = self.load(n)
        r.current += 1
        return self._status(r, ACTIVE, WAITING)

    def abandon(self, n: int, why: str = ""):
        return self._status(self.load(n), ABANDONED, DRAFT, READY, ACTIVE, WAITING, why=why)

    def _status(self, r, to: str, *allowed: str, **event):
        if r.status not in allowed:
            raise Refused(f"plan {r.n} is {r.status}, not one that can become {to}")
        r.status = to
        return self.save(r, "updated", status=to, **event)

    def _phase(self, r, p: int) -> dict:
        try:
            return r.phases[int(p) - 1]
        except IndexError:
            raise Refused(f"plan {r.n} has no phase {p}")

    def _user_only(self, word: str) -> None:
        if self.actor == AGENT:
            raise Refused(f"only the user can {word} a plan: they do it in the viewer")


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
            raise Refused(f"{OPEN_SUGGESTIONS} suggestions already wait on the user: {', '.join(str(s.n) for s in waiting)}")
        declined = [s for s in self.all() if s.decision == DECLINE.lower() and s.title.lower() == title.lower()]
        if declined and not data.pop("despite", None):
            s = declined[-1]
            raise Refused(f"suggestion {s.n} was declined{': ' + s.outcome if s.outcome else ''}; --set despite=true --set because=\"<what changed>\" to propose it again")
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


class Styles(Controller):
    resource = types.Style


class Connections(Controller):
    resource = types.Connection


class Environments(Controller):
    resource = types.Environment

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        name = check_title(title)
        if any(e.title == name for e in self.all()):
            raise Refused(f"environment {name!r} exists: switch to it")
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
            raise Refused(f"environment {env.title!r} is taken by session {holder}: claim it with a reason, or work another")
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
        held = {t: len([r for r in CONTROLLERS[t](record, actor=SYSTEM).all() if not r.completed]) for t in ("todo", "pin", "reminder", "message", "question")}
        holder = Sessions(self.record.root).holder(env.title)
        if holder:
            raise Refused(f"environment {env.title!r} is held by session {holder}; it leaves first")
        kept = ", ".join(f"{v} open {k}s" for k, v in held.items() if v)
        if kept and not yes:
            raise Refused(f"environment {env.title!r} holds {kept}; --yes removes it anyway (its record goes to the attic)")
        if record.home.is_dir():
            attic.pack(record.home, f"{env.title}-{int(time.time())}")
        self.force_delete(n)
        return f"environment {env.title!r} removed; its record is packed in attic/ — journal environment unarchive {env.title} brings it back"

    def unarchive(self, name: str):
        archive = attic.latest(self.record.root, name)
        if not archive:
            raise Refused(f"no archived environment {name!r} in attic/")
        if any(e.title == name for e in self.all()):
            raise Refused(f"environment {name!r} exists: rename it before bringing the archived one back")
        attic.unpack(archive, Record(self.record.root, name).home)
        return self.create(name)

    def rename(self, n: int, name: str):
        env = self.load(n)
        new = check_title(name)
        if any(e.title == new for e in self.all()):
            raise Refused(f"environment {new!r} exists")
        holder = self.sessions().holder(env.title)
        if holder and holder != self.session:
            raise Refused(f"environment {env.title!r} is held by session {holder}; it leaves first")
        old = Record(self.record.root, env.title).home
        if old.is_dir():
            old.rename(old.with_name(new))
        Sessions(self.record.root).rebind(env.title, new)
        return self.update(n, title=new)

    def pickup(self, n: int) -> dict:
        env = self.load(n)
        record = Record(self.record.root, env.title)
        return {"environment": env.title, "holder": self.sessions().holder(env.title),
                **{f"open {t}s": [f"{r.n} {r.title}" for r in CONTROLLERS[t](record, actor=SYSTEM).all() if not r.completed][:10] for t in ("work", "todo", "question", "message")},
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


CONTROLLERS = {c.resource.type: c for c in (Messages, Todos, Works, Plans, Docs, Reports, Pins, Rules, Reminders, Suggestions,
                                            Questions, Comments, Agents, Notifications, Notices, Reactions, Tools, Styles, Connections, Environments, Asks, Nudges)}
