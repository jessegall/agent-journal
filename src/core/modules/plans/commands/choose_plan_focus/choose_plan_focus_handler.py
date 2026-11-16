from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.plans.commands.choose_plan_focus.choose_plan_focus import ChoosePlanFocus
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.focus.plan_focus import PlanFocus
from core.modules.plans.support.focus.plan_focus_report import PlanFocusReport

PERSON_HEADING = "the focus of the main agent:"
CLEARED_LINE = "your focus is the default again"
UNAPPROVED_TEXTS = {PlanState.DRAFT: "a draft", PlanState.READY: "ready"}
FOCUSED_STATES = (PlanState.APPROVED, PlanState.STARTED)


class ChoosePlanFocusHandler(Handler[ChoosePlanFocus, tuple[str, ...]]):
    """Names a plan as the focus of the asking agent, clears it, or only reads it, and answers with the lines
    of the focus. An agent changes its own focus alone; a user changes that of the running main agent. A
    plan that is not approved or started is refused, and so is a number that is no plan of this environment,
    with the same words as a plan that does not exist."""

    command = ChoosePlanFocus

    def __init__(self, queries: Queries, focus: PlanFocus, report: PlanFocusReport) -> None:
        self.queries, self.focus, self.report = queries, focus, report

    def handle(self, command: ChoosePlanFocus, context: Context) -> tuple[str, ...]:
        is_person = not context.actor.is_agent()
        agent = self.main_agent() if is_person else self.queries.query(Agent).find(context.actor.id)
        heading = [PERSON_HEADING] if is_person else []
        if command.clears:
            return (*heading, CLEARED_LINE, *self.report.lines(self.focus.clear(agent, context)))
        if command.plan_id is None:
            return (*heading, *self.report.lines(agent))
        return (*heading, *self.report.lines(self.focus.choose(agent, self.focused_plan(command.plan_id), context)))

    def main_agent(self) -> Agent:
        main_agent = MainAgentFinder.newest(self.queries)
        if main_agent is None:
            raise Refusal("no main agent is running, so there is no focus to read or set", "journal launch")
        return main_agent

    def focused_plan(self, plan_id: int) -> Plan:
        plan = self.queries.query(Plan).filter(id=plan_id).first()
        if plan is None:
            raise Refusal("no such plan", "journal plan list")
        if plan.state in UNAPPROVED_TEXTS:
            raise Refusal(f"plan {plan.id} is {UNAPPROVED_TEXTS[plan.state]}: a user must approve it first", "journal plan list --state started")
        if plan.state not in FOCUSED_STATES:
            raise Refusal(f"plan {plan.id} is {plan.state.value}: focus a started or an approved plan", "journal plan list --state started")
        return plan
