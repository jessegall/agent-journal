from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.command.move_row import MoveRow
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.documents.models.enums.link_type import LinkType
from core.modules.documents.models.link import Link
from core.modules.documents.models.report import Report
from core.modules.plans.models.plan import Plan
from core.modules.templates.support.review_state import REVIEWED_MOVE, REVIEWING

MODULE_NAME = "journal.core.templates"


class CritiqueReportListener(CommitListener):
    """A report about a plan under review ends the review: the plan is ready again, for a person to read the
    report and approve it or not."""

    name = "templates.critique-report"
    event = "link.create"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.bus, self.actors, self.queries = bus, actors, queries

    def handle(self, event: LoggedEvent) -> None:
        link = self.queries.query(Link).find(event.row_id)
        if link.link_type is not LinkType.SUBJECT or link.source_model != Report.model_name or link.target_model != Plan.model_name:
            return
        plan = self.queries.query(Plan).find(link.target_id)
        if plan.state != REVIEWING:
            return
        self.bus.run(MoveRow(Plan.model_name, plan.id, REVIEWED_MOVE.name), self.actors.actor(MODULE_NAME), cause_id=event.id, environment_id=plan.environment_id)
