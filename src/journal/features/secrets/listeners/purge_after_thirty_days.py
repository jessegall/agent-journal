import time
from datetime import datetime, timedelta, timezone

from journal.events.agent.ticked import Ticked
from journal.features.agent_listener import AgentListener
from journal.features.secrets.browser_logins import BrowserLogins
from journal.models.actor import Actor
from journal.models.secret_field import SecretField
from journal.repositories.secrets import Secrets
from journal.secret_values import SecretValues

KEPT = timedelta(days=30)
EVERY = 3600.0
"""The purge looks once an hour."""


class PurgeAfterThirtyDays(AgentListener[Ticked]):
    """A secret deleted thirty days ago goes for good, its values, its saved login and its row; a value replaced thirty days ago stops being kept for masking."""

    def __init__(self, secrets: Secrets, values: SecretValues, logins: BrowserLogins) -> None:
        self.secrets, self.values, self.logins = secrets, values, logins
        self._looked_at = 0.0

    def handle(self, event: Ticked) -> None:
        if time.time() - self._looked_at < EVERY:
            return
        self._looked_at = time.time()
        cutoff = datetime.now(timezone.utc) - KEPT
        for secret in self.secrets.gone():
            if secret.deleted_at < cutoff:
                self.values.drop([SecretField.of(raw).variable for raw in secret.fields])
                self.logins.forget(secret.title)
                self.secrets.delete(secret, Actor.system())
        retired = self.values.retired_before(cutoff.timestamp())
        if retired:
            self.values.drop(retired)
