from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.container import Container
from core.modules.phone.commands.send_phone_notices.send_phone_notices import SendPhoneNotices


class PhoneNotices:
    """The notices that wait on paired phones are pushed."""

    def __call__(self, container: Container) -> None:
        container.get(Bus).run(SendPhoneNotices(), Actor.core())
