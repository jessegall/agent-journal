from dataclasses import dataclass

from engine.keeper import READY
from features.hosting.apps import address
from features.hosting.files import hosting_of

APP_STATES = {"starting": "App starting", "not started": "App starting"}


@dataclass(frozen=True)
class CardExtra:
    actions: list
    link: str = ""
    link_label: str = ""


def app_on_card(record, ticket) -> CardExtra:
    if not hosting_of(record.root.parent):
        return CardExtra([])
    if not ticket.hosted:
        return CardExtra([{"label": "Run its app", "action": "host"}])
    app = address(record.root, ticket)
    stop = [{"label": "Stop its app", "action": "unhost"}]
    if app["state"] == READY:
        return CardExtra(stop, app["url"], "Open app")
    return CardExtra(stop, "", APP_STATES.get(app["state"], f"App stopped: {app['why'] or app['state']}"))
