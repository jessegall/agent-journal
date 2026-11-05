from core.base.actor_type import ActorType
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.refusal import Refusal
from core.modules.library.support.library_address import ADDRESS_SETTING
from core.modules.settings.models.setting import Setting
from core.base.change.changed import Changed
from core.base.command.context import Context


class LibraryAddressGuard(Guard[Changed[Setting]]):
    """Refuses a change of the shared server's address by anyone but a person."""

    name = "library.address-by-person"

    def check(self, event: Changed[Setting], context: Context) -> None:
        setting = event.row
        if setting.key == ADDRESS_SETTING and context.actor.type is not ActorType.USER:
            raise Refusal("only a person changes the address of the shared server", "ask the user to set it on the Teams page or with journal setting set")
