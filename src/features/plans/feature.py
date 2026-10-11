from controllers.types import Works
from engine.events.engine import ClockTicked
from engine.events.resources import TodoCompleted
from expects import Given, Kept, Nudged, Refused, Unchanged, Updated
from features.base import Feature
from features.plans.summary import plans_shown
from overview.parts import SUMMARY_PARTS
from features.journal import Journal
from features.plans.details import PlansDetails
from features.plans.handlers import (
    AdvancePlans,
    DelegatePlansOfHandedRows,
    EndReviewWithItsReport,
    GuideBuilding,
    PassCheckpointsInAuto,
    ReopenPlansWithTheirRows,
    StartApproved,
    StartBuilding,
    TakeStruckRowsOutOfUnapprovedPlans,
    TellParkedAndPickedUp,
    blocked_plans,
    still_plans,
)
from features.sending import Nudge
from features.plans.interceptors import HoldWhilePlanned, RefusePlanMode
from features.plans.progress import held
from features.work_tracking.next import ROW_HOLDS
from features.plans.handlers import PlanChanged, ReportLinked, RowReopened, TodoUpdated
from features.plans.resource import Plan
from providers.payload import ToolUse
from resources.base import AGENT, SYSTEM, USER
from resources.types import AgentRow, Todo

STILL_TIMES = 3
PLAN_MODE_REFUSED = ('plan mode is not used in a journal project - write the plan as a journal plan instead: '
                     'journal plan create "<name>" --set goal="<what is true when done>", then its phases and rows')
NOT_IN_THE_CURRENT_PHASE = "todo {} is not in the active plan's current phase: finish the plan, raise it to critical, or --force \"<why>\""
A_PLAN_IS_ACTIVE = "a plan is active: open work for a row of its current phase with journal todo start <n>, or --force \"<why>\""

AGENT_ROW = AgentRow(n=1, title="claude-1")


def plan(status: str, **data) -> Plan:
    return Plan(n=1, title="Ship it", data={"status": status, **data})


def phases(*todos: int, checkpoint: bool = False) -> list:
    return [{"title": f"Phase {n}", "todos": [todo], "checkpoint": checkpoint and n == 1} for n, todo in enumerate(todos, 1)]


def finished(n: int) -> TodoCompleted:
    return TodoCompleted(n=n, type="todo", action="completed", actor=USER)


def done(n: int) -> Todo:
    return Todo(n=n, title=f"Row {n}", completed=1.0)


def reopened(n: int) -> RowReopened:
    return RowReopened(n=n, type="todo", action="reopened", actor=USER)


def reviewed(to: str) -> ReportLinked:
    return ReportLinked(n=9, type="report", action="linked", actor=AGENT, to=to)


def changed(action: str, actor: str, status: str = "", **fields) -> PlanChanged:
    return PlanChanged(n=1, type="plan", action=action, actor=actor, status=status, **fields)


class PlansFeature(Feature):
    details = PlansDetails
    nudges = (Nudge("still", behaviour="still", about=still_plans, most=STILL_TIMES,
                    guarantee="When a running plan has not moved for a while, the agent is told, a few times."),
              Nudge("blocked", behaviour="blocked", about=blocked_plans,
                    guarantee="When a running plan has blocked to-dos, the agent is told to check whether each one is still blocked."))

    def register(self, journal: Journal) -> None:
        SUMMARY_PARTS.add(None, plans_shown, key="plans")
        ROW_HOLDS.add(self, held)
        journal.events.handler(StartBuilding(), expects=[
            Given(changed("created", USER), rows=[plan("building"), AGENT_ROW]) >> Nudged("started"),
            Given(changed("created", AGENT), rows=[plan("building"), AGENT_ROW]) >> Unchanged(),
            Given(changed("created", USER), rows=[plan("building")]) >> Unchanged(),
        ])
        journal.events.handler(DelegatePlansOfHandedRows(), expects=[
            Given(TodoUpdated(n=5, type="todo", action="updated", actor=USER), rows=[Todo(n=5, title="Row 5", data={"assigned": "helper:3"}), plan("active", phases=phases(5))]) >> Updated(Plan(n=1), delegated=True),
            Given(TodoUpdated(n=5, type="todo", action="updated", actor=USER), rows=[Todo(n=5, title="Row 5"), plan("active", phases=phases(5))]) >> Unchanged(),
            Given(TodoUpdated(n=5, type="todo", action="updated", actor=USER), rows=[Todo(n=5, title="Row 5", completed=1.0, data={"assigned": "helper:3"}), plan("active", phases=phases(5))]) >> Unchanged(),
        ])
        journal.events.handler(StartApproved(), expects=[
            Given(changed("updated", USER), rows=[plan("approved"), AGENT_ROW]) >> Nudged("approved"),
            Given(changed("updated", SYSTEM), rows=[plan("approved"), AGENT_ROW]) >> Nudged("approved"),
            Given(changed("updated", AGENT), rows=[plan("approved"), AGENT_ROW]) >> Unchanged(),
            Given(changed("updated", USER), rows=[plan("building"), AGENT_ROW]) >> Unchanged(),
            Given(changed("updated", USER), rows=[plan("approved")]) >> Unchanged(),
        ])
        journal.events.handler(EndReviewWithItsReport(), expects=[
            Given(reviewed("plan:1"), rows=[plan("reviewing"), AGENT_ROW]) >> Nudged("reviewed"),
            Given(reviewed("plan:1"), rows=[plan("building"), AGENT_ROW]) >> Unchanged(),
            Given(reviewed("todo:5"), rows=[plan("reviewing"), AGENT_ROW]) >> Unchanged(),
        ])
        journal.events.handler(TellParkedAndPickedUp(), expects=[
            Given(changed("updated", USER, "active"), rows=[plan("active"), AGENT_ROW]) >> Nudged("picked up"),
            Given(changed("updated", USER, "parked"), rows=[plan("parked"), AGENT_ROW]) >> Nudged("parked"),
            Given(changed("updated", USER, "parked", parked_for=2), rows=[plan("parked"), AGENT_ROW]) >> Unchanged(),
            Given(changed("updated", AGENT, "parked"), rows=[plan("parked"), AGENT_ROW]) >> Unchanged(),
            Given(changed("updated", USER, "approved"), rows=[plan("approved"), AGENT_ROW]) >> Unchanged(),
        ])
        journal.events.handler(GuideBuilding(), expects=[
            Given(changed("linked", AGENT), rows=[plan("building"), AGENT_ROW]) >> Nudged("phases"),
            Given(changed("linked", AGENT), rows=[plan("building", stage="todos", phases=[]), AGENT_ROW]) >> Nudged("todos"),
            Given(changed("linked", USER), rows=[plan("building"), AGENT_ROW]) >> Unchanged(),
            Given(changed("linked", AGENT), rows=[plan("active"), AGENT_ROW]) >> Unchanged(),
            Given(changed("updated", AGENT), rows=[plan("building"), AGENT_ROW]) >> Nudged("phases"),
        ])
        journal.events.handler(PassCheckpointsInAuto(), expects=[
            Given(ClockTicked(agent=1), rows=[AGENT_ROW, done(5), Todo(n=6, title="Row 6"), plan("waiting", phases=phases(5, 6, checkpoint=True), current=1)], settings={"features.work_tracking.auto": True}) >> Updated(Plan(n=1), status="active"),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW, done(5), Todo(n=6, title="Row 6"), plan("waiting", phases=phases(5, 6, checkpoint=True), current=1)], settings={"features.work_tracking.auto": False}) >> Unchanged(),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW, Todo(n=5, title="Row 5"), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6), current=1)], settings={"features.work_tracking.auto": True}) >> Unchanged(),
        ])
        journal.events.handler(AdvancePlans(), expects=[
            Given(finished(5), rows=[done(5), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6))]) >> Updated(Plan(n=1), current=2),
            Given(finished(5), rows=[done(5), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6), current=1)]) >> Updated(Plan(n=1), status="active"),
            Given(finished(5), rows=[done(5), plan("active", phases=phases(5))]) >> Updated(Plan(n=1), status="done"),
            Given(finished(5), rows=[done(5), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6, checkpoint=True))], settings={"features.work_tracking.auto": False}) >> Updated(Plan(n=1), status="waiting"),
            Given(finished(5), rows=[done(5), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6, checkpoint=True))], settings={"features.work_tracking.auto": True}) >> Updated(Plan(n=1), current=2),
            Given(finished(5), rows=[Todo(n=5, title="Row 5"), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6))]) >> Unchanged(),
            Given(finished(5), rows=[done(5), plan("parked", phases=phases(5))]) >> Unchanged(),
        ])
        journal.events.handler(ReopenPlansWithTheirRows(), expects=[
            Given(reopened(5), rows=[Todo(n=5, title="Row 5"), plan("active", phases=phases(5, 6), current=2)]) >> Updated(Plan(n=1), status="active", current=1),
            Given(reopened(5), rows=[Todo(n=5, title="Row 5"), plan("active", phases=phases(5, 6), current=1)]) >> Unchanged(),
            Given(reopened(5), rows=[Todo(n=5, title="Row 5"), plan("abandoned", phases=phases(5, 6), current=2)]) >> Unchanged(),
            Given(reopened(9), rows=[Todo(n=9, title="Row 9"), plan("active", phases=phases(5, 6), current=2)]) >> Unchanged(),
        ])
        journal.events.handler(TakeStruckRowsOutOfUnapprovedPlans(), expects=[
            Given(finished(5), rows=[Todo(n=5, title="Row 5", completed=1.0, data={"struck": "not needed"}), plan("building", phases=phases(5))]) >> Updated(Plan(n=1), phases=[{"title": "Phase 1", "todos": [], "checkpoint": False}]),
            Given(finished(5), rows=[Todo(n=5, title="Row 5", completed=1.0, data={"struck": "not needed"}), plan("active", phases=phases(5))]) >> Unchanged(),
            Given(finished(5), rows=[done(5), plan("building", phases=phases(5))]) >> Unchanged(),
        ])
        journal.agent.interceptor(RefusePlanMode(), expects=[
            Given(ToolUse.from_payload("EnterPlanMode", {}, {})) >> Refused(PLAN_MODE_REFUSED),
            Given(ToolUse.from_payload("Read", {}, {})) >> Kept(),
        ])
        journal.commands.intercept("work.open", HoldWhilePlanned(), expects=[
            Given((Works, {"actor": AGENT}, {"todo": 6}), rows=[Todo(n=5, title="Row 5"), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6))]) >> Refused(NOT_IN_THE_CURRENT_PHASE.format(6)),
            Given((Works, {"actor": AGENT}, {"todo": 5}), rows=[Todo(n=5, title="Row 5"), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6))]) >> Kept(),
            Given((Works, {"actor": AGENT}, {"todo": 9}), rows=[Todo(n=9, title="Row 9"), plan("active", phases=phases(5, 6))]) >> Refused(NOT_IN_THE_CURRENT_PHASE.format(9)),
            Given((Works, {"actor": AGENT}, {"todo": 9}), rows=[Todo(n=9, title="Row 9", data={"priority": 300}), plan("active", phases=phases(5, 6))]) >> Kept(),
            Given((Works, {"actor": AGENT}, {"todo": 9}), rows=[Todo(n=9, title="Row 9")]) >> Kept(),
            Given((Works, {"actor": AGENT}, {"todo": 9}), rows=[Todo(n=9, title="Row 9"), plan("parked", phases=phases(5, 6))]) >> Kept(),
            Given((Works, {"actor": AGENT}, {}), rows=[plan("active", phases=phases(5, 6))]) >> Refused(A_PLAN_IS_ACTIVE),
            Given((Works, {"actor": AGENT}, {}), rows=[plan("parked", phases=phases(5, 6))]) >> Kept(),
        ])
