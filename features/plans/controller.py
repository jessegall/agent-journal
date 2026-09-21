import controllers.types as types_module
import resources.types as resources_module
from controllers.base import Controller
from controllers.types import Docs, Todos
from features.plans.resource import PHASE, Plan
from resources.base import AGENT, SECTION, Refused, check_title

BUILDING, DRAFT, READY, ACTIVE, WAITING, DONE, ABANDONED = "building", "draft", "ready", "active", "waiting", "done", "abandoned"
ENDED = (DONE, ABANDONED)
PHASES, TODOS = "phases", "todos"
STAGES = (PHASES, TODOS)


class Plans(Controller):
    resource = Plan

    def create(self, title: str, abstract: str = "", brief: str = "", **data):
        return super().create(title, abstract, brief, status=BUILDING if self.actor == AGENT else DRAFT, stage=PHASES, phases=[], current=1, **data)

    def from_doc(self, doc: int):
        source = Docs(self.record, actor=self.actor).load(int(doc))
        plan = self.create(source.title, brief=source.brief, goal=source.abstract)
        for s in source.sections:
            if s[SECTION.title].lower().startswith("phase"):
                self.phase(plan.n, s[SECTION.title].split(":", 1)[-1].split("—", 1)[-1].strip() or s[SECTION.title], brief=s[SECTION.body])
        return self.link(plan.n, source.ref)

    def stage(self, n: int, at: str):
        if at not in STAGES:
            raise Refused(f"a plan is written in stages: {' or '.join(STAGES)}")
        return self.update(n, stage=at)

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
                self.refuse(f"todo {t} already sits in phase {elsewhere} of plan {n}; --move takes it out of there")
            for ph in r.phases:
                ph[PHASE.todos] = [x for x in ph[PHASE.todos] if x != t]
            phase[PHASE.todos].append(t)
        for t in todos:
            ref = f"todo:{int(t)}"
            r.refs = [x for x in r.refs if x != ref] if off else r.refs + [ref] * (ref not in r.refs)
        return self.save(r, "linked", phase=int(p), todos=[int(t) for t in todos], off=off)

    def build(self, n: int):
        return self._status(self.load(n), BUILDING, READY, DRAFT)

    def ready(self, n: int):
        r = self.load(n)
        for i, ph in enumerate(r.phases, 1):
            if not ph[PHASE.todos]:
                self.refuse(f"plan {n} cannot be ready: phase {i} has no to-dos")
        return self._status(r, READY, BUILDING, DRAFT)

    def activate(self, n: int):
        self._user_only("activate")
        r = self.load(n)
        if any(x.status in (ACTIVE, WAITING) for x in self.all() if x.n != n):
            self.refuse("one plan is active at a time on an environment")
        return self._status(r, ACTIVE, DRAFT, READY)

    def resume(self, n: int):
        self._user_only("continue")
        r = self.load(n)
        r.current += 1
        return self._status(r, ACTIVE, WAITING)

    def abandon(self, n: int, why: str = ""):
        return self._status(self.load(n), ABANDONED, BUILDING, DRAFT, READY, ACTIVE, WAITING, why=why)

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
            self.refuse(f"only the user can {word} a plan: they do it in the viewer")


resources_module.register(Plan)
types_module.register(Plans)
