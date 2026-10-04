import os
import shutil
import signal
import time
from collections import Counter
from controllers.base import CONTROLLERS, Controller, internal
from engine import attic
from engine.record import Record
from engine.seats import terminal_of
from engine.sessions import Sessions, alive
from engine.stop import ask_session
from resources import types
from resources.base import AGENT, ENVIRONMENT, SYSTEM, UNTITLED, Refused, check_title
from engine import runtime
from engine.paths import environment_path
from engine.wording import plural
from controllers.facts import Facts
from controllers.messages import Messages
from controllers.questions import Questions
from controllers.reminders import Reminders
from controllers.todos import Todos
from controllers.works import Works


SWEPT = ("message", "comment", "reaction", "notification", "notice", "nudge")
KEPT = ("agent", "feature", "environment")
SEED = "feature"


def seeded(folder) -> bool:
    return not any(row.parent.name != SEED for row in folder.glob("*/[0-9]*.md"))


class Environments(Controller):
    OPEN_BEFORE_REMOVING = (Todos, Facts, Reminders, Messages, Questions)
    PICKED_UP = (Works, Todos, Questions, Messages)
    resource = types.Environment

    def update(self, n: int, title: str | None = None, **data):
        if title is not None:
            raise Refused("rename an environment with journal environment rename")
        return super().update(n, **data)

    def _seat(self, name: str, session: str):
        row = self._titled(name) or self.create(name)
        return self.update(row.n, holder=session)

    def unused(self, name: str, hint: str = "") -> str:
        if self._titled(name):
            raise Refused(f"environment {name!r} exists{hint}")
        return name

    def vacant(self, title: str, mine: str = "") -> None:
        holder = Sessions(self.record.root).holder(title)
        if holder and holder != mine:
            found = self._titled(title)
            ending = f"journal environment stop {found.n} ends its agent" if found else "its agent ends"
            self._refuse(f"environment {title!r} is held by session {holder}; {ending} first")

    def stop(self, n: int):
        env = self.load(n)
        sessions = Sessions(self.record.root)
        holder = sessions.holder(env.title)
        if not holder:
            self._refuse(f"no agent holds environment {env.title!r}")
        terminal = terminal_of(self.record.root, holder)
        if terminal:
            ask_session(self.record.root, terminal)
            return self._stopping(env.n, session=holder)
        running = sessions.read(holder)
        if not running.pid or not alive(running.pid):
            self._refuse(f"the agent in {env.title} runs outside the journal's terminals and its process is not found; end it where it runs")
        os.kill(running.pid, signal.SIGTERM)
        return self._stopping(env.n, session=holder)

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        if title.strip() in ("", UNTITLED):
            self._refuse("an environment needs a name")
        name = self.unused(check_title(title), ": switch to it")
        environment_path(self.record.root / "environments", name)
        made = super().create(name, abstract, brief, **data)
        Record(self.record.root, name)
        runtime.forget_rename(self.record.root, name)
        return made

    @internal
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
            self._refuse(f"environment {env.title!r} is taken by session {holder}: claim it with a reason, or work another")
        before = self.sessions().environment(who)
        self.sessions().bind(who, env.title)
        running = self.sessions().read(who)
        terminal = self.sessions().terminal(running.provider, running.pid) if running.pid else ""
        if terminal and terminal != who:
            self.sessions().bind(terminal, env.title)
        if before and before != env.title:
            self.sessions().write(who, before=before)
        if project:
            runtime.set_env(self.record.root, env.title)
        return self.update(n, holder=who)

    def complete(self, n: int, how: str = "", yes: bool = False, **data):
        env = self.load(n)
        record = Record(self.record.root, env.title)
        held = {c.resource.type: len(c(record, actor=SYSTEM)._standing()) for c in self.OPEN_BEFORE_REMOVING}
        self.vacant(env.title)
        kept = ", ".join(f"{v} open {k}s" for k, v in held.items() if v)
        if kept and not yes:
            self._refuse(f"environment {env.title!r} holds {kept}; --yes removes it anyway (its record goes to the attic)")
        if record.home.is_dir():
            attic.pack(record.home, f"{env.title}-{int(time.time())}")
        self.force_delete(n)
        return f"environment {env.title!r} removed; its record is packed in attic/ — journal environment unarchive {env.title} brings it back"

    def sweep(self, n: int, yes: bool = False):
        env = self.load(n)
        record = Record(self.record.root, env.title)
        chosen = [(rows, row["n"]) for rows in self._sweepable(record) for row in rows.summaries()
                  if rows.type in SWEPT or row["completed"] or row["deleted"]]
        counted = Counter(rows.type for rows, _ in chosen)
        summary = ", ".join(plural(count, kind) for kind, count in sorted(counted.items())) or "nothing"
        if not yes:
            return f"a sweep of {env.title!r} packs {summary} into the attic and keeps its facts, rules, reminders, docs and open rows; --yes sweeps"
        if not chosen:
            return f"environment {env.title!r} has nothing to sweep"
        stamp = int(time.time())
        stage = self.record.root / "environments" / f".swept-{env.title}-{stamp}"
        for rows, number in chosen:
            kept = stage / rows.type
            kept.mkdir(parents=True, exist_ok=True)
            (kept / rows.path(number).name).write_text(rows._text(number))
            rows._remove(number)
            files = rows.path(number).with_suffix("")
            if files.is_dir():
                shutil.move(str(files), kept / files.name)
        attic.pack(stage, f"{env.title}-swept-{stamp}")
        return f"swept {summary} from {env.title!r} into attic/{env.title}-swept-{stamp}{attic.SUFFIX}"

    def _sweepable(self, record) -> list:
        return [controller(record, actor=SYSTEM) for controller in CONTROLLERS.values()
                if controller.resource.scope == ENVIRONMENT and controller.resource.type not in KEPT]

    def unarchive(self, name: str):
        environment_path(self.record.root / "environments", name)
        archive = attic.latest(self.record.root, name)
        if not archive:
            raise Refused(f"no archived environment {name!r} in attic/")
        self.unused(name, ": rename it before bringing the archived one back")
        attic.unpack(archive, Record(self.record.root, name).home)
        return self.create(name)

    def rename(self, n: int, name: str):
        env = self.load(n)
        new = self.unused(check_title(name))
        environment_path(self.record.root / "environments", new)
        self.vacant(env.title, self.session)
        old = Record(self.record.root, env.title).home
        taken = old.with_name(new)
        if taken.is_dir() and not seeded(taken):
            self._refuse(f"a folder for {new!r} already holds rows at {taken}; remove that environment first or choose another name")
        if taken.is_dir():
            attic.pack(taken, f"{new}-seed-{int(time.time())}")
        if old.is_dir():
            old.rename(taken)
        Sessions(self.record.root).rebind(env.title, new)
        return super().update(n, title=new)

    def pickup(self, n: int) -> dict:
        env = self.load(n)
        record = Record(self.record.root, env.title)
        return {"environment": env.title, "holder": self.sessions().holder(env.title),
                **{f"open {c.resource.type}s": [f"{r.n} {r.title}" for r in c(record, actor=SYSTEM)._standing()][:10] for c in self.PICKED_UP},
                "facts": [f"{r.n} {r.title}" for r in Facts(record, actor=SYSTEM)._standing()][:10]}

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
