from agents.terminal import LAUNCH_ARGS
from controllers.types import Agents
from engine.seats import live_session
from engine.sessions import Sessions
from features.base import Feature
from features.journal import Journal
from features.permission_prompts.details import PermissionsDetails
from features.permission_prompts.handlers import ShowWaitingPermission
from features.permission_prompts.skipping import launch_args, skipped
from providers import DRIVERS
from resources.base import SYSTEM


class PermissionPrompts(Feature):
    details = PermissionsDetails

    def register(self, journal: Journal) -> None:
        if launch_args not in LAUNCH_ARGS:
            LAUNCH_ARGS.append(launch_args)
        journal.events.handler(ShowWaitingPermission())

    def settings_view(self, record) -> dict:
        primary = Agents(record, actor=SYSTEM).primary()
        pair = live_session(record.root, primary.title) if primary else None
        seat = pair[1] if pair else None
        driver = DRIVERS.get(seat.provider) if seat else None
        args = list(Sessions(record.root).read(seat.terminal).args) if seat else []
        return {"skip": skipped(record), "session": seat.session if seat else "",
                "running": bool(driver and driver.SKIP_ARGS and set(driver.SKIP_ARGS) <= set(args)),
                "possible": bool(driver and driver.SKIP_ARGS)}

