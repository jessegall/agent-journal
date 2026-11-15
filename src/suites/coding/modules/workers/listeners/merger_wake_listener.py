from engine.actor.actor import Actor
from engine.event.logged_event import LoggedEvent
from engine.event.created import Created
from engine.command.bus import Bus
from engine.driver.message_template import MessageTemplate
from engine.listener.commit.commit_listener import CommitListener
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.agent_messages.merger_line_available_message import MergerLineAvailableMessage


class MergerWakeListener(CommitListener[Created[MergerLine]]):
    """Wakes the merger when a line waits for it."""

    name = "workers.merger-wake"

    def __init__(self, bus: Bus, settings: SettingValues) -> None:
        self.bus, self.settings = bus, settings

    def handle(self, event: Created[MergerLine], logged: LoggedEvent) -> None:
        if not self.settings.flag(MERGER_ENABLED):
            return
        line = MergerLineAvailableMessage.declared().agent_message(line=event.row.id) if event.row.agent_message_json is None else MessageTemplate.restore(event.row.agent_message_json)
        self.bus.run(StartMerger(line), Actor.core(), cause_id=logged.id, environment_id=event.row.environment_id)
