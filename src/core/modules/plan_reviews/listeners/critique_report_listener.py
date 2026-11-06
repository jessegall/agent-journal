from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.command.move_row import MoveRow
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.models.report import Report
from core.modules.plans.models.plan import Plan
from core.modules.skills.commands.request_skill.request_skill import RequestSkill
from core.modules.plan_reviews.support.review_state import REVIEWED_MOVE, REVIEWING
from core.base.change.created import Created

MODULE_NAME = "journal.core.plan_reviews"
REVIEW_APPLYING_SKILL = "journal-plan-review-applying"


class CritiqueReportListener(CommitListener[Created[Link]]):
    """A report about a plan under review makes the skill for working a review into a plan due for the agent
    that made the plan, or the main agent when a person made it, and ends the review: the plan is ready again,
    for a person to read the report and approve it or not."""

    name = "plan_reviews.critique-report"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: Created[Link], logged: LoggedEvent) -> None:
        link = event.row
        if link.link_type is not LinkType.SUBJECT or link.source_model != Report.model_name or link.target_model != Plan.model_name:
            return
        plan = self.queries.query(Plan).find(link.target_id)
        if plan.state != REVIEWING:
            return
        for agent_id in self.applying_agent_ids(plan):
            self.bus.run(RequestSkill(agent_id, REVIEW_APPLYING_SKILL), self.actors.actor(MODULE_NAME), cause_id=logged.id)
        self.bus.run(MoveRow(Plan.model_name, plan.id, REVIEWED_MOVE.name), self.actors.actor(MODULE_NAME), cause_id=logged.id)

    def applying_agent_ids(self, plan: Plan) -> tuple[int, ...]:
        maker = self.queries.query(Agent).filter(id=plan.creator_id).first()
        return tuple([maker.id]) if maker is not None else tuple(agent.id for agent in MainAgentFinder.rows(self.queries))
