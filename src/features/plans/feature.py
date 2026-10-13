from events.agents import ClockTicked
from events.todos import TodoCompleted
from dataclasses import replace

from expects import WHEN, Answered, Dispatches, Given, Kept, Nudged, Refused, Unchanged, Updated, nothing
from framework.base import Feature
from features.plans.summary import plans_shown
from declaring.registries import SUMMARY_PARTS
from framework.journal import Journal
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
    TellReviewEnded,
)
from features.plans.listeners import (
    SpotApprovedPlan,
    SpotBuildingToGuide,
    SpotCheckpointToPass,
    SpotPlanBegun,
    SpotPlanMovedByUser,
    SpotPlanOfHandedRow,
    SpotPlansToAdvance,
    SpotReopenedRowOfAPlan,
    SpotReviewReport,
    SpotStruckRowOfAnUnapprovedPlan,
)
from features.plans.answering import RefusePlanMode
from features.plans.refusing import HoldWhilePlanned
from features.plans.watching import STANDING_STILL, STILL_TIMES, blocked_plans, still_plans
from events.asking import RowWriting, ToolCallAsked
from events.answers import Allowed, Refused as Refusal
from events.plans import (CheckpointPassed, PlanApproved, PlanBuildBegun, PlanBuildingGuided, PlanHandedToHelper, PlanMovedByUser, PlanRowReopened, PlansToAdvance,
                          ReviewEndedWithReport, ReviewReportLinked, StruckRowInUnapprovedPlan)
from framework.sending import Nudge
from declaring.registries import ROW_HOLDS
from events.plans import PlanChanged
from events.reports import ReportLinked
from events.todos import TodoUpdated
from resources.plans import DEPTHS, Plan
from events.resources import AnyEvent, RowReopened
from controllers.types import Plans
from resources.base import AGENT, SYSTEM, USER
from resources.types import AgentRow, Question, Todo, Work

PLAN_MODE_REFUSED = ('plan mode is not used in a journal project - write the plan as a journal plan instead: '
                     'journal plan create "<name>" --set goal="<what is true when done>", then its phases and rows')
NOT_IN_THE_CURRENT_PHASE = "todo {} is not in the active plan's current phase: finish the plan, raise it to critical, or --force \"<why>\""
A_PLAN_IS_ACTIVE = "a plan is active: open work for a row of its current phase with journal todo start <n>, or --force \"<why>\""

AGENT_ROW = AgentRow(n=1, title="claude-1")


def writing(**fields) -> RowWriting:
    return RowWriting(type="work", action="open", actor=AGENT, fields=tuple(fields.items()))


def plan(status: str, **data) -> Plan:
    return Plan(n=1, title="Ship it", data={"status": status, **data})


def phases(*todos: int, checkpoint: bool = False) -> list:
    return [{"title": f"Phase {n}", "todos": [todo], "checkpoint": checkpoint and n == 1} for n, todo in enumerate(todos, 1)]


VISIBLE = [{"title": "Every nudge is visible", "todos": [4366, 4367], "checkpoint": False}]


def row(n: int, **data) -> Todo:
    return Todo(n=n, title=f"Row {n}", data=data)


def done(n: int) -> Todo:
    return Todo(n=n, title=f"Row {n}", completed=1.0)


def reopened(n: int) -> RowReopened:
    return RowReopened(n=n, type="todo", action="reopened", actor=USER)


def reviewed(to: str) -> ReportLinked:
    return ReportLinked(n=9, type="report", action="linked", actor=AGENT, to=to)


def changed(action: str, actor: str, status: str = "", **fields) -> PlanChanged:
    return PlanChanged(n=1, type="plan", action=action, actor=actor, status=status, **fields)


STILL_CASES = (
    Given(ClockTicked(agent=1), rows=[plan("active", phases=VISIBLE), row(4366), row(4367), AGENT_ROW])
        >> Nudged("standing still", phase="Every nudge is visible", rows="4366, 4367"),
    Given(ClockTicked(agent=1), rows=[plan("active", phases=VISIBLE), row(4366, blocked="waiting on the key"), row(4367), Question(n=1, title="Which branch?", refs=["todo:4367"]), AGENT_ROW])
        >> Nudged("blocked", rows="Row 4366"),
    Given(ClockTicked(agent=1), rows=[plan("active", phases=VISIBLE), row(4366, blocked="waiting on the key"), row(4367), AGENT_ROW]) >> Nudged("blocked", rows="Row 4366"),
    Given(ClockTicked(agent=1), rows=[plan("active", phases=VISIBLE), row(4366, after=["todo:9000"]), row(4367), row(9000), AGENT_ROW]) >> Unchanged(),
    Given(ClockTicked(agent=1), rows=[plan("active", phases=VISIBLE), Todo(n=4366, title="Row 4366", updated=WHEN - 60), row(4367), AGENT_ROW]) >> Unchanged(),
    Given(ClockTicked(agent=1), rows=[plan("active", phases=VISIBLE), row(4366), row(4367), Work(n=3, title="Build it", data={"todo": 4367}), AGENT_ROW]) >> Unchanged(),
    Given(ClockTicked(agent=1), rows=[plan("active", phases=VISIBLE), done(4366), done(4367), AGENT_ROW]) >> Unchanged(),
    Given(ClockTicked(agent=1), rows=[plan("parked", phases=VISIBLE), row(4366), row(4367), AGENT_ROW]) >> Unchanged(),
    Given(ClockTicked(agent=1), rows=[plan("active", phases=VISIBLE), row(4366), row(4367)]) >> Unchanged(),
)


def held(record, todo) -> bool:
    return Plans(record, actor=SYSTEM).holds(todo)


class PlansFeature(Feature):
    details = PlansDetails
    nudges = (Nudge("still", behaviour="still", about=still_plans, most=STILL_TIMES,
                    guarantee="When a running plan has not moved for a while, the agent is told, a few times."),
              Nudge("blocked", behaviour="blocked", about=blocked_plans,
                    guarantee="When a running plan has blocked to-dos, the agent is told to check whether each one is still blocked."),
              replace(STANDING_STILL, expects=STILL_CASES))

    def register(self, journal: Journal) -> None:
        SUMMARY_PARTS.add(None, plans_shown, key="plans")
        ROW_HOLDS.add(self, held)
        journal.events.listen(PlanChanged, SpotPlanBegun(), expects=[
            Given(changed("created", USER), rows=[plan("building"), AGENT_ROW]) >> Dispatches(PlanBuildBegun(plan=1, title="Ship it", depth=DEPTHS["normal"])),
            Given(changed("created", AGENT), rows=[plan("building"), AGENT_ROW]) >> Dispatches(nothing),
            Given(changed("created", USER), rows=[plan("building")]) >> Dispatches(nothing),
            Given(changed("updated", USER), rows=[plan("building"), AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(PlanBuildBegun, StartBuilding(), expects=[
            Given(PlanBuildBegun(plan=1, title="Ship it", depth=DEPTHS["normal"]), rows=[plan("building"), AGENT_ROW]) >> Nudged("started"),
        ])
        journal.events.listen(TodoUpdated, SpotPlanOfHandedRow(), expects=[
            Given(TodoUpdated(n=5, type="todo", action="updated", actor=USER), rows=[Todo(n=5, title="Row 5", data={"assigned": "helper:3"}), plan("active", phases=phases(5))])
                >> Dispatches(PlanHandedToHelper(plan=1)),
            Given(TodoUpdated(n=5, type="todo", action="updated", actor=USER), rows=[Todo(n=5, title="Row 5"), plan("active", phases=phases(5))]) >> Dispatches(nothing),
            Given(TodoUpdated(n=5, type="todo", action="updated", actor=USER), rows=[Todo(n=5, title="Row 5", completed=1.0, data={"assigned": "helper:3"}), plan("active", phases=phases(5))])
                >> Dispatches(nothing),
            Given(TodoUpdated(n=5, type="todo", action="updated", actor=USER), rows=[Todo(n=5, title="Row 5", data={"assigned": "helper:3"}), plan("parked", phases=phases(5))]) >> Dispatches(nothing),
            Given(TodoUpdated(n=5, type="todo", action="updated", actor=USER), rows=[Todo(n=5, title="Row 5", data={"assigned": "helper:3"}), plan("active", phases=phases(4, 5), current=1)]) >> Dispatches(nothing),
        ])
        journal.events.handle(PlanHandedToHelper, DelegatePlansOfHandedRows(), expects=[
            Given(PlanHandedToHelper(plan=1), rows=[plan("active", phases=phases(5))]) >> Updated(Plan(n=1), delegated=True),
        ])
        journal.events.listen(PlanChanged, SpotApprovedPlan(), expects=[
            Given(changed("updated", USER), rows=[plan("approved"), AGENT_ROW]) >> Dispatches(PlanApproved(plan=1, title="Ship it").once("approved|1")),
            Given(changed("updated", SYSTEM), rows=[plan("approved"), AGENT_ROW]) >> Dispatches(PlanApproved(plan=1, title="Ship it").once("approved|1")),
            Given(changed("updated", AGENT), rows=[plan("approved"), AGENT_ROW]) >> Dispatches(nothing),
            Given(changed("updated", USER), rows=[plan("building"), AGENT_ROW]) >> Dispatches(nothing),
            Given(changed("updated", USER), rows=[plan("approved")]) >> Dispatches(nothing),
            Given(changed("created", USER), rows=[plan("approved"), AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(PlanApproved, StartApproved(), expects=[
            Given(PlanApproved(plan=1, title="Ship it"), rows=[plan("approved"), AGENT_ROW]) >> Nudged("approved"),
        ])
        journal.events.listen(ReportLinked, SpotReviewReport(), expects=[
            Given(reviewed("plan:1"), rows=[plan("reviewing"), AGENT_ROW])
                >> Dispatches(ReviewReportLinked(plan=1)) & Dispatches(ReviewEndedWithReport(plan=1, title="Ship it", report=9)),
            Given(reviewed("plan:1"), rows=[plan("reviewing")]) >> Dispatches(ReviewReportLinked(plan=1)),
            Given(reviewed("plan:1"), rows=[plan("building"), AGENT_ROW]) >> Dispatches(nothing),
            Given(reviewed("todo:5"), rows=[plan("reviewing"), AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(ReviewReportLinked, EndReviewWithItsReport(), expects=[
            Given(ReviewReportLinked(plan=1), rows=[plan("reviewing")]) >> Updated(Plan(n=1), status="building"),
        ])
        journal.events.handle(ReviewEndedWithReport, TellReviewEnded(), expects=[
            Given(ReviewEndedWithReport(plan=1, title="Ship it", report=9), rows=[plan("building"), AGENT_ROW]) >> Nudged("reviewed"),
        ])
        journal.events.listen(PlanChanged, SpotPlanMovedByUser(), expects=[
            Given(changed("updated", USER, "active"), rows=[plan("active"), AGENT_ROW]) >> Dispatches(PlanMovedByUser(line="picked up", plan=1, title="Ship it", phase=1)),
            Given(changed("updated", USER, "parked"), rows=[plan("parked"), AGENT_ROW]) >> Dispatches(PlanMovedByUser(line="parked", plan=1, title="Ship it", phase=1)),
            Given(changed("updated", USER, "parked", parked_for=2), rows=[plan("parked"), AGENT_ROW]) >> Dispatches(nothing),
            Given(changed("updated", AGENT, "parked"), rows=[plan("parked"), AGENT_ROW]) >> Dispatches(nothing),
            Given(changed("updated", USER, "approved"), rows=[plan("approved"), AGENT_ROW]) >> Dispatches(nothing),
            Given(changed("updated", USER, "active"), rows=[plan("active")]) >> Dispatches(nothing),
            Given(changed("created", USER, "active"), rows=[plan("active"), AGENT_ROW]) >> Dispatches(nothing),
        ])
        journal.events.handle(PlanMovedByUser, TellParkedAndPickedUp(), expects=[
            Given(PlanMovedByUser(line="picked up", plan=1, title="Ship it", phase=1), rows=[plan("active"), AGENT_ROW]) >> Nudged("picked up"),
            Given(PlanMovedByUser(line="parked", plan=1, title="Ship it", phase=1), rows=[plan("parked"), AGENT_ROW]) >> Nudged("parked"),
        ])
        journal.events.listen(PlanChanged, SpotBuildingToGuide(), expects=[
            Given(changed("linked", AGENT), rows=[plan("building"), AGENT_ROW]) >> Dispatches(PlanBuildingGuided(plan=1, line="phases").once("planned|1:phases")),
            Given(changed("linked", AGENT), rows=[plan("building", stage="todos", phases=[]), AGENT_ROW]) >> Dispatches(PlanBuildingGuided(plan=1, line="todos").once("planned|1:todos")),
            Given(changed("linked", USER), rows=[plan("building"), AGENT_ROW]) >> Dispatches(nothing),
            Given(changed("linked", AGENT), rows=[plan("active"), AGENT_ROW]) >> Dispatches(nothing),
            Given(changed("updated", AGENT), rows=[plan("building"), AGENT_ROW]) >> Dispatches(PlanBuildingGuided(plan=1, line="phases").once("planned|1:phases")),
            Given(changed("linked", AGENT), rows=[plan("building", stage="todos", phases=phases(5, 6)), AGENT_ROW]) >> Dispatches(PlanBuildingGuided(plan=1, line="ready").once("planned|1:ready")),
            Given(changed("linked", AGENT), rows=[plan("building")]) >> Dispatches(nothing),
        ])
        journal.events.handle(PlanBuildingGuided, GuideBuilding(), expects=[
            Given(PlanBuildingGuided(plan=1, line="phases"), rows=[plan("building"), AGENT_ROW]) >> Nudged("phases"),
            Given(PlanBuildingGuided(plan=1, line="todos"), rows=[plan("building", stage="todos", phases=[]), AGENT_ROW]) >> Nudged("todos"),
        ])
        journal.events.listen(ClockTicked, SpotCheckpointToPass(), expects=[
            Given(ClockTicked(agent=1), rows=[AGENT_ROW, done(5), Todo(n=6, title="Row 6"), plan("waiting", phases=phases(5, 6, checkpoint=True), current=1)], settings={"features.work_tracking.auto": True})
                >> Dispatches(CheckpointPassed(plan=1)),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW, done(5), Todo(n=6, title="Row 6"), plan("waiting", phases=phases(5, 6, checkpoint=True), current=1)], settings={"features.work_tracking.auto": False})
                >> Dispatches(nothing),
            Given(ClockTicked(agent=1), rows=[AGENT_ROW, Todo(n=5, title="Row 5"), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6), current=1)], settings={"features.work_tracking.auto": True})
                >> Dispatches(nothing),
        ])
        journal.events.handle(CheckpointPassed, PassCheckpointsInAuto(), expects=[
            Given(CheckpointPassed(plan=1), rows=[AGENT_ROW, done(5), Todo(n=6, title="Row 6"), plan("waiting", phases=phases(5, 6, checkpoint=True), current=1)]) >> Updated(Plan(n=1), status="active"),
        ])
        journal.events.listen(AnyEvent, SpotPlansToAdvance(), expects=[
            Given(AnyEvent(n=5, type="todo", action="completed", actor=USER), rows=[done(5), plan("active", phases=phases(5))], settings={"features.work_tracking.auto": False})
                >> Dispatches(PlansToAdvance(passing=False)),
            Given(AnyEvent(n=5, type="todo", action="completed", actor=USER), rows=[done(5), plan("active", phases=phases(5))], settings={"features.work_tracking.auto": True})
                >> Dispatches(PlansToAdvance(passing=True)),
            Given(AnyEvent(n=5, type="todo", action="created", actor=USER), rows=[done(5), plan("active", phases=phases(5))]) >> Dispatches(nothing),
            Given(AnyEvent(n=5, type="ticket", action="completed", actor=USER), rows=[plan("active", phases=phases(5))], settings={"features.work_tracking.auto": False}) >> Dispatches(PlansToAdvance(passing=False)),
            Given(AnyEvent(n=1, type="plan", action="updated", actor=USER), rows=[plan("active", phases=phases(5))], settings={"features.work_tracking.auto": False}) >> Dispatches(PlansToAdvance(passing=False)),
            Given(AnyEvent(n=1, type="agent", action="reported", actor=AGENT), rows=[plan("active", phases=phases(5))], settings={"features.work_tracking.auto": False}) >> Dispatches(PlansToAdvance(passing=False)),
        ])
        journal.events.handle(PlansToAdvance, AdvancePlans(), expects=[
            Given(PlansToAdvance(passing=True), rows=[done(5), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6))]) >> Updated(Plan(n=1), current=2),
            Given(PlansToAdvance(passing=True), rows=[done(5), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6), current=1)]) >> Updated(Plan(n=1), status="active"),
            Given(PlansToAdvance(passing=True), rows=[done(5), plan("active", phases=phases(5))]) >> Updated(Plan(n=1), status="done"),
            Given(PlansToAdvance(passing=False), rows=[done(5), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6, checkpoint=True))]) >> Updated(Plan(n=1), status="waiting"),
            Given(PlansToAdvance(passing=True), rows=[done(5), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6, checkpoint=True))]) >> Updated(Plan(n=1), current=2),
        ])
        journal.events.listen(RowReopened, SpotReopenedRowOfAPlan(), expects=[
            Given(reopened(5), rows=[Todo(n=5, title="Row 5"), plan("active", phases=phases(5, 6), current=2)]) >> Dispatches(PlanRowReopened(plan=1, type="todo", n=5, phase=1, was_done=False)),
            Given(reopened(5), rows=[Todo(n=5, title="Row 5"), plan("active", phases=phases(5, 6), current=1)]) >> Dispatches(nothing),
            Given(reopened(5), rows=[Todo(n=5, title="Row 5"), plan("abandoned", phases=phases(5, 6), current=2)]) >> Dispatches(nothing),
            Given(reopened(9), rows=[Todo(n=9, title="Row 9"), plan("active", phases=phases(5, 6), current=2)]) >> Dispatches(nothing),
            Given(reopened(5), rows=[Todo(n=5, title="Row 5"), Plan(n=1, title="Ship it", completed=1.0, data={"status": "done", "phases": phases(5, 6), "current": 2})])
                >> Dispatches(PlanRowReopened(plan=1, type="todo", n=5, phase=1, was_done=True)),
            Given(RowReopened(n=5, type="report", action="reopened", actor=USER), rows=[plan("active", phases=phases(5, 6), current=2)]) >> Dispatches(nothing),
        ])
        journal.events.handle(PlanRowReopened, ReopenPlansWithTheirRows(), expects=[
            Given(PlanRowReopened(plan=1, type="todo", n=5, phase=1, was_done=False), rows=[Todo(n=5, title="Row 5"), plan("active", phases=phases(5, 6), current=2)])
                >> Updated(Plan(n=1), status="active", current=1),
        ])
        journal.events.listen(TodoCompleted, SpotStruckRowOfAnUnapprovedPlan(), expects=[
            Given(TodoCompleted.of(5), rows=[Todo(n=5, title="Row 5", completed=1.0, data={"struck": "not needed"}), plan("building", phases=phases(5))])
                >> Dispatches(StruckRowInUnapprovedPlan(plan=1, phase=1, todo=5)),
            Given(TodoCompleted.of(5), rows=[Todo(n=5, title="Row 5", completed=1.0, data={"struck": "not needed"}), plan("active", phases=phases(5))]) >> Dispatches(nothing),
            Given(TodoCompleted.of(5), rows=[done(5), plan("building", phases=phases(5))]) >> Dispatches(nothing),
            Given(TodoCompleted.of(5), rows=[Todo(n=5, title="Row 5", completed=1.0, data={"struck": "not needed"}), plan("building", phases=phases(9))]) >> Dispatches(nothing),
        ])
        journal.events.handle(StruckRowInUnapprovedPlan, TakeStruckRowsOutOfUnapprovedPlans(), expects=[
            Given(StruckRowInUnapprovedPlan(plan=1, phase=1, todo=5), rows=[Todo(n=5, title="Row 5", completed=1.0, data={"struck": "not needed"}), plan("building", phases=phases(5))])
                >> Updated(Plan(n=1), phases=[{"title": "Phase 1", "todos": [], "checkpoint": False}]),
        ])
        journal.events.answer(ToolCallAsked, RefusePlanMode(), expects=[
            Given(ToolCallAsked(tool="EnterPlanMode", session="claude-1")) >> Answered(Refusal(PLAN_MODE_REFUSED)),
            Given(ToolCallAsked(tool="Read", session="claude-1")) >> Answered(Allowed()),
            Given(ToolCallAsked(tool="EnterPlanMode", session="claude-1", subagent=True)) >> Answered(Allowed()),
        ])
        journal.commands.refuse(RowWriting, HoldWhilePlanned(), expects=[
            Given(writing(todo=6), rows=[Todo(n=5, title="Row 5"), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6))]) >> Refused(NOT_IN_THE_CURRENT_PHASE.format(6)),
            Given(writing(todo=5), rows=[Todo(n=5, title="Row 5"), Todo(n=6, title="Row 6"), plan("active", phases=phases(5, 6))]) >> Kept(),
            Given(writing(todo=9), rows=[Todo(n=9, title="Row 9"), plan("active", phases=phases(5, 6))]) >> Refused(NOT_IN_THE_CURRENT_PHASE.format(9)),
            Given(writing(todo=9), rows=[Todo(n=9, title="Row 9", data={"priority": 300}), plan("active", phases=phases(5, 6))]) >> Kept(),
            Given(writing(todo=9), rows=[Todo(n=9, title="Row 9")]) >> Kept(),
            Given(writing(todo=9), rows=[Todo(n=9, title="Row 9"), plan("parked", phases=phases(5, 6))]) >> Kept(),
            Given(writing(), rows=[plan("active", phases=phases(5, 6))]) >> Refused(A_PLAN_IS_ACTIVE),
            Given(writing(), rows=[plan("parked", phases=phases(5, 6))]) >> Kept(),
            Given(RowWriting(type="todo", action="create", actor=AGENT), rows=[plan("active", phases=phases(5, 6))]) >> Kept(),
            Given(writing(todo=5), rows=[Todo(n=5, title="Row 5"), plan("done", phases=phases(5))]) >> Kept(),
        ])
