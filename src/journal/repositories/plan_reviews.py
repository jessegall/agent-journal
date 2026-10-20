from journal.db.connection import Connection
from journal.events.bus import Bus
from journal.models.plan import Plan
from journal.models.plan_review import PlanReview
from journal.repositories.links import Links
from journal.repositories.scoped_repository import ScopedRepository
from journal.support.scope import Scope

REVIEWS = "reviews"
FILED = "filed"


class PlanReviews(ScopedRepository[PlanReview]):
    model = PlanReview

    def __init__(self, connection: Connection, bus: Bus, scope: Scope, links: Links) -> None:
        super().__init__(connection, bus, scope)
        self.links = links

    def of(self, plan: Plan) -> list[PlanReview]:
        """The plan's review rounds, newest first."""
        return list(reversed(self.numbered(ref.id for ref in self.links.sources(plan, REVIEWS))))

    def open_of(self, plan: Plan) -> list[PlanReview]:
        return [review for review in self.of(plan) if review.is_open()]
