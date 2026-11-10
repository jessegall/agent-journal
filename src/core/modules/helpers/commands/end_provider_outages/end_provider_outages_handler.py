from core.modules.helpers.support.program_change_access import ProgramChangeAccess
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.helpers.commands.end_provider_outages.end_provider_outages import EndProviderOutages
from core.modules.helpers.models.provider_outage import ProviderOutage


class EndProviderOutagesHandler(Handler[EndProviderOutages, None]):
    """Ends all active outages of one program in a single transaction."""

    command = EndProviderOutages

    def __init__(self, queries: Queries, repository: Repository, access: ProgramChangeAccess) -> None:
        self.queries, self.repository, self.access = queries, repository, access

    def handle(self, command: EndProviderOutages, context: Context) -> None:
        self.access.check(context.actor)
        for row in self.queries.query(ProviderOutage).filter(program=command.program).all_rows():
            if row.ends_at <= context.timestamp:
                continue
            self.repository.save(row.changed(ends_at=context.timestamp), context)
