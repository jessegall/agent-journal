from expects import Given, Kept, Nudged, Refused, Unchanged
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
from features.plans.handlers import PlanChanged, ReportLinked
from features.plans.resource import Plan
from providers.payload import ToolUse
from resources.base import AGENT, SYSTEM, USER
from resources.types import AgentRow

STILL_TIMES = 3
PLAN_MODE_REFUSED = ('plan mode is not used in a journal project - write the plan as a journal plan instead: '
                     'journal plan create "<name>" --set goal="<what is true when done>", then its phases and rows')

AGENT_ROW = AgentRow(n=1, title="claude-1")


def plan(status: str, **data) -> Plan:
    return Plan(n=1, title="Ship it", data={"status": status, **data})


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
        journal.events.handler(DelegatePlansOfHandedRows())
        journal.events.handler(StartApproved(), expects=[
            Given(changed("updated", USER), rows=[plan("approved"), AGENT_ROW]) >> Nudged("approved"),
            Given(changed("updated", SYSTEM), rows=[plan("approved"), AGENT_ROW]) >> Nudged("approved"),
            Given(changed("updated", AGENT), rows=[plan("approved"), AGENT_ROW]) >> Unchanged(),
            Given(changed("updated", USER), rows=[plan("building"), AGENT_ROW]) >> Unchanged(),
            Given(changed("updated", USER), rows=[plan("approved")]) >> Unchanged(),
        ])
        journal.events.handler(EndReviewWithItsReport())
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
        journal.events.handler(PassCheckpointsInAuto())
        journal.events.handler(AdvancePlans())
        journal.events.handler(ReopenPlansWithTheirRows())
        journal.events.handler(TakeStruckRowsOutOfUnapprovedPlans())
        journal.agent.interceptor(RefusePlanMode(), expects=[
            Given(ToolUse.from_payload("EnterPlanMode", {}, {})) >> Refused(PLAN_MODE_REFUSED),
            Given(ToolUse.from_payload("Read", {}, {})) >> Kept(),
        ])
        journal.commands.intercept("work.open", HoldWhilePlanned())
