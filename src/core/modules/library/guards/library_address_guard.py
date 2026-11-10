from engine.errors.user_approval_refusal import UserApprovalRefusal
from engine.enums.actor_type import ActorType
from engine.guard.guard import Guard
from core.modules.library.support.library_address import ADDRESS_SETTING
from core.modules.settings.models.setting import Setting
from engine.event.changed import Changed
from engine.command.context import Context


class LibraryAddressGuard(Guard[Changed[Setting]]):
    """Refuses a change of the shared server's address by anyone but a person."""

    name = "library.address-by-person"
    is_safety = True

    def check(self, event: Changed[Setting], context: Context) -> None:
        setting = event.row
        if setting.key == ADDRESS_SETTING and context.actor.type is not ActorType.USER:
            raise UserApprovalRefusal("Change the shared server address?", command=context.command)
