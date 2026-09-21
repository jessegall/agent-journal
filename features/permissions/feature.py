from controllers.types import Agents
from engine.seats import live
from engine.sessions import Sessions
from features.base import Feature
from features.journal import Journal
from features.permissions.details import PermissionsDetails
from features.permissions.handlers import ShowWaitingPermission
from providers import DRIVERS
from resources.base import SYSTEM


class Permissions(Feature):
    details = PermissionsDetails

    def register(self, journal: Journal) -> None:
        journal.events.handler(ShowWaitingPermission())

    def settings_view(self, record) -> dict:
        primary = Agents(record, actor=SYSTEM).primary()
        seat = next((found for _, found in live(record.root) if primary and found["session"] == primary.title), None)
        driver = DRIVERS.get(seat["provider"]) if seat else None
        args = Sessions(record.root).read(seat["terminal"]).get("args") or [] if seat else []
        return {"skip": bool(record.setting(self.name, {}).get("skip")), "session": seat["session"] if seat else "",
                "running": bool(driver and driver.SKIP_ARGS and set(driver.SKIP_ARGS) <= set(args)),
                "possible": bool(driver and driver.SKIP_ARGS)}
