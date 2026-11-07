from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.helpers.commands.make_provider_outage.make_provider_outage import MakeProviderOutage
from core.modules.helpers.models.provider_outage import ProviderOutage
from core.modules.helpers.support.program_change_access import ProgramChangeAccess


class MakeProviderOutageHandler(Handler[MakeProviderOutage, ProviderOutage]):
    """Records a program outage after checking who asked."""

    command = MakeProviderOutage

    def __init__(self, repository: Repository, access: ProgramChangeAccess) -> None:
        self.repository, self.access = repository, access

    def handle(self, command: MakeProviderOutage, context: Context) -> ProviderOutage:
        self.access.check(context.actor)
        return self.repository.save(ProviderOutage(creator_id=context.actor.id, **command.model_fields()), context)
