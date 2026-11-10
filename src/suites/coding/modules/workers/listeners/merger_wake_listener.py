from engine.actor.actor import Actor
from engine.change.logged_event import LoggedEvent
from engine.change.created import Created
from engine.command.bus import Bus
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.listener.commit_listener import CommitListener
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.support.merger_nudges import MERGER_LINE_AVAILABLE


class MergerWakeListener(CommitListener[Created[MergerLine]]):
    """Wakes the merger when a line waits for it."""

    name = "workers.merger-wake"

    def __init__(self, bus: Bus, settings: SettingValues) -> None:
        self.bus, self.settings = bus, settings

    def handle(self, event: Created[MergerLine], logged: LoggedEvent) -> None:
        if not self.settings.flag(MERGER_ENABLED):
            return
        line = MERGER_LINE_AVAILABLE.nudge(line=event.row.id) if event.row.nudge_json is None else NudgeDeclaration.restore(event.row.nudge_json)
        self.bus.run(StartMerger(line), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
