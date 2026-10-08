from features.integrations.base import IntegrationFeature
from features.journal import Journal
from features.linear.commands import ProposeComment, SyncLinear
from features.linear.details import LinearDetails
from features.linear.handlers import CheckLinear, MoveIssue, SendApprovedComment
from features.linear.routes import LinearWebhook
from features.linear.webhook import Deliveries
from features.linear.working import LinearWork
from features.sharing.routes import ROUTES


class Linear(LinearWork, IntegrationFeature):
    key_refused = ("answered 401", "answered 403")
    details = LinearDetails
    origin = "https://api.linear.app"

    def register(self, journal: Journal) -> None:
        super().register(journal)
        self.deliveries = Deliveries()
        ROUTES.add(self, LinearWebhook(self), key="linear")
        journal.events.handler(CheckLinear())
        journal.events.handler(MoveIssue())
        journal.events.handler(SendApprovedComment())
        journal.commands.add("feature", SyncLinear())
        journal.commands.add("ticket", ProposeComment())
        journal.routes.add(self.teams_route(), self.check_route(), self.webhook_route())
