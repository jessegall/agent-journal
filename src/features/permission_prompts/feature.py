from controllers.types import Agents
from engine.seats import live
from engine.sessions import Sessions
from features.base import Feature
from features.journal import Journal
from features.permission_prompts.details import PermissionsDetails
from features.permission_prompts.handlers import ShowWaitingPermission
from providers import DRIVERS
from resources.base import SYSTEM


class Permissions(Feature):
    details = PermissionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ShowWaitingPermission())

    def settings_view(self, record) -> dict:
        primary = Agents(record, actor=SYSTEM).primary()
        seat = next((found for _, found in live(record.root) if primary and found.session == primary.title), None)
        driver = DRIVERS.get(seat.provider) if seat else None
        args = list(Sessions(record.root).read(seat.terminal).args) if seat else []
        return {"skip": skipped(record), "session": seat.session if seat else "",
                "running": bool(driver and driver.SKIP_ARGS and set(driver.SKIP_ARGS) <= set(args)),
                "possible": bool(driver and driver.SKIP_ARGS)}


def skipped(record) -> bool:
    return bool(record.setting("permission_prompts", {}).get("skip", True))


def prompted(record) -> None:
    record.set_setting("permission_prompts", {**record.setting("permission_prompts", {}), "skip": False})
