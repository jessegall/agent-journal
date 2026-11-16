from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.setting.setting_values import SettingValues
from core.modules.drivers.commands.record_wake_delivery.record_wake_delivery import RecordWakeDelivery
from core.modules.drivers.models.agent_wake import AgentWake
from core.modules.drivers.models.enums.wake_state import WakeState
from core.modules.drivers.support.driver_settings import WAKE_RETRY_SETTING


class RecordWakeDeliveryHandler(Handler[RecordWakeDelivery, AgentWake]):
    """A claimed wake its transport sent is delivered until a turn of the agent acknowledges it or wake-retry-seconds
    pass; a row that is no longer claimed, as an acknowledgement or a cancel came first, stays as it is."""

    command = RecordWakeDelivery

    def __init__(self, queries: Queries, repository: Repository, settings: SettingValues) -> None:
        self.queries, self.repository, self.settings = queries, repository, settings

    def handle(self, command: RecordWakeDelivery, context: Context) -> AgentWake:
        wake = self.queries.query(AgentWake).find(command.wake_id)
        if wake.state is not WakeState.CLAIMED:
            return wake
        return self.repository.update(wake, context, state=WakeState.DELIVERED, lease_ends_at=None,
                                      next_attempt_at=context.timestamp.plus_seconds(self.settings.number(WAKE_RETRY_SETTING)))
