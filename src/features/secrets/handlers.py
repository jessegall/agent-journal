from events import Fact
from events.secrets import PurgeDue
from receiving import Handler
from resources.secrets import Secret
from serving import Rows


class PurgeDeletedSecrets(Handler[PurgeDue]):
    def handle(self, event: PurgeDue, secrets: Rows[Secret]) -> list[Fact]:
        secrets.purge_expired()
        return []
