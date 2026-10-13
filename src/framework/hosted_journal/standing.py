from framework.hosted_journal.settings import FromRecord, FromVault
from controllers.sharing.origins import ProxyLookup, ProxyOrigins
APART = "AGENT_JOURNAL_APART"


class Standing:
    """What a hosted journal stands on, decided once from the process it starts in: whether it runs apart, where its gateway settings come from, and how it looks up proxies."""

    def __init__(self, apart: bool) -> None:
        self.apart = apart
        self.lookup = ProxyLookup()
        self.settings = FromVault() if apart else FromRecord()

    def origins(self, record) -> ProxyOrigins:
        return ProxyOrigins(self.settings.of(record).proxy, self.lookup)

    def address(self, record) -> str:
        return self.settings.of(record).address
