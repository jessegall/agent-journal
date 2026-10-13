from controllers.types import Phones, Shares
from framework.phone.feed import waiting
from resources.base import SYSTEM


def told(record) -> None:
    """Pushes each phone that has subscribed when something new waits for it on its home screen."""
    address = Shares(record, actor=SYSTEM)._address()
    if not address:
        return
    phones = Phones(record, actor=SYSTEM)
    for phone in phones.actives():
        if phone.push is not None:
            tell(phones, phone, address)


def tell(phones, phone, address: str) -> None:
    owed = owed_to(phones, phone)
    if set(owed) - set(phone.pushed):
        phones._push(phone, f"https://{address}")
    if owed != phone.pushed:
        phones.keep_pushed(phone.n, owed)


def owed_to(phones, phone) -> list[str]:
    """What waits for this phone on its home screen, by reference."""
    return [item["ref"] for item in waiting(phones.home(phone), phone)]
