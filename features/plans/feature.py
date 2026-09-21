from controllers.types import Agents, Todos
from features.plans.controller import ACTIVE, BUILDING, DONE, PHASES, Plans, WAITING
from features.work.auto import automatic
from features.base import Feature, Line, event
from features.plans.progress import current_phase, running
from resources.base import AGENT, SYSTEM
from features.plans.resource import PHASE
from features.journal import Journal
from features.plans.interceptors import HoldWhilePlanned, RefusePlanMode


class PlansFeature(Feature):
    name = "plans"
    title_ = "Planning"
    abstract_ = "A plan advances as its rows close: a phase completes, a checkpoint waits, the last phase ends it"
    help_ = ("A plan is built in order. journal plan create \"<name>\" --set goal=\"<what is true when done>\" starts it building, at its phases stage. "
             "Add every phase with journal plan phase <n> \"<title>\" --when \"<complete when>\" (--checkpoint where the user should look before it goes on). "
             "Then journal plan stage <n> todos, file the rows and put each under its phase with journal plan todos <n> <phase> <rows...>. "
             "When every phase has rows, journal plan ready <n> hands it to the user. "
             "Only the user activates a plan and continues it past a checkpoint; with the auto feature on, checkpoints are passed without waiting.")
    lines = {"phases": Line("plan {{n}} is building - add its phases",
                            "journal plan phase {{n}} \"<title>\" --when \"<complete when>\" for each phase, --checkpoint where the user should look; then journal plan stage {{n}} todos"),
             "todos": Line("plan {{n}} is at its to-dos",
                           "file each phase's rows and put them under it with journal plan todos {{n}} <phase> <rows...>; when every phase has rows, journal plan ready {{n}}"),
             "ready": Line("every phase of plan {{n}} has its to-dos", "journal plan ready {{n}} hands it to the user, who activates it"),
             "plan mode": Line("plan mode is not used in a journal project",
                               "write the plan as a journal plan instead: journal plan create \"<name>\" --set goal=\"<what is true when done>\", then its phases and rows")}

    def register(self, journal: Journal) -> None:
        journal.agent.interceptor(RefusePlanMode())
        journal.commands.intercept("todo.start", HoldWhilePlanned())

    @event("plan.created")
    @event("plan.updated")
    @event("plan.linked")
    def guide(self, event, record) -> None:
        plan = Plans(record, actor=SYSTEM).load(event.n)
        agent = Agents(record, actor=SYSTEM).primary()
        if event.actor != AGENT or plan.status != BUILDING or not agent:
            return
        stage = plan.stage or PHASES
        filled = bool(plan.phases) and all(p[PHASE.todos] for p in plan.phases)
        line = "ready" if stage != PHASES and filled else stage
        if not self.already(record, agent.title, "planned", f"{plan.n}:{line}"):
            self.journal.say(record, agent, line, n=plan.n)

    def phase_complete(self, record, phase: dict) -> bool:
        todos = Todos(record, actor=SYSTEM)
        return all(todos.load(n).completed for n in phase[PHASE.todos])

    @event("agent.updated")
    def pass_checkpoints(self, event, record) -> None:
        if not automatic(record):
            return
        plans = Plans(record, actor=SYSTEM)
        for plan in plans._every():
            if plan.status == WAITING:
                plans.resume(plan.n)

    def step(self, record, plan) -> bool:
        phase = current_phase(plan)
        if plan.status != ACTIVE or phase is None or not self.phase_complete(record, phase):
            return False
        i = plan.current
        last = i == len(plan.phases)
        waits = bool(phase[PHASE.checkpoint]) and not automatic(record)
        plan.status = DONE if last else WAITING if waits else ACTIVE
        plan.current = i if last or waits else i + 1
        Plans(record, actor=SYSTEM).save(plan, "updated", phase=i, complete=True, status=plan.status,
                                         passed=bool(phase[PHASE.checkpoint]) and not waits)
        return not (last or waits)

    def catch_up(self, record) -> None:
        for plan in running(record):
            while self.step(record, plan):
                pass

    @event("todo.completed")
    def advance(self, event, record) -> None:
        self.catch_up(record)

    @event("plan.updated")
    @event("agent.updated")
    def settle(self, event, record) -> None:
        self.catch_up(record)
