from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.container import Container
from core.base.file_access import FileAccess
from core.base.journal_home import JournalHome
from core.base.query.queries import Queries
from core.modules.drivers.models.hook_call import HookCall
from core.modules.messages.commands.reset_message_deliveries.reset_message_deliveries import ResetMessageDeliveries


class HookDeliveryRetries:
    """Keeps lost hook answers on disk until their message deliveries have been reset."""

    def __init__(self, home: JournalHome) -> None:
        self.folder = home.folder / "runtime" / "lost-hook-answers"

    def keep(self, hook_call_id: int) -> None:
        self.folder.mkdir(parents=True, exist_ok=True)
        FileAccess.shared().update_timestamp(self.folder / str(hook_call_id))

    def retry(self, container: Container) -> None:
        for path in self.folder.glob("*"):
            call = container.get(Queries).query(HookCall).find(int(path.name))
            container.get(Bus).run(ResetMessageDeliveries(call.id), Actor.core(), environment_id=call.environment_id)
            path.unlink(missing_ok=True)
