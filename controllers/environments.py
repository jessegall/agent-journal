import time
from controllers.base import Controller, internal
from engine import attic
from engine.record import Record
from engine.sessions import Sessions
from resources import types
from resources.base import SYSTEM, Refused, check_title
from engine import runtime
from controllers.facts import Facts
from controllers.messages import Messages
from controllers.questions import Questions
from controllers.reminders import Reminders
from controllers.todos import Todos
from controllers.works import Works


class Environments(Controller):
    resource = types.Environment
    OPEN_BEFORE_REMOVING = (Todos, Facts, Reminders, Messages, Questions)
    PICKED_UP = (Works, Todos, Questions, Messages)

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
            self._refuse(f"environment {title!r} is held by session {holder}; it leaves first")

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        name = self.unused(check_title(title), ": switch to it")
        made = super().create(name, abstract, brief, **data)
        Record(self.record.root, name)
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
