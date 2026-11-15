from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.setting.setting_values import SettingValues
from core.modules.drivers.commands.refresh_agent_pin.refresh_agent_pin import RefreshAgentPin
from core.modules.drivers.models.agent_stack import AgentStack
from core.modules.drivers.support.driver_settings import ACTIVE_SLICES_SETTING


class RefreshAgentPinHandler(Handler[RefreshAgentPin, AgentStack]):
    """Sets an agent's pinned parts to the parts live in its environment; only a person repins, and an agent
    with no stack yet takes the live parts at its first step."""

    command = RefreshAgentPin

    def __init__(self, queries: Queries, repository: Repository, settings: SettingValues) -> None:
        self.queries, self.repository, self.settings = queries, repository, settings

    def handle(self, command: RefreshAgentPin, context: Context) -> AgentStack:
        if context.actor.is_agent():
            raise Refusal("only a person repins an agent")
        row = self.queries.query(AgentStack).filter(session_agent_id=command.agent_id).first()
        if row is None:
            raise Refusal(f"agent {command.agent_id} has no stack yet: its first step pins it")
        return self.repository.save(row.changed(pinned_slices=self.settings.texts(ACTIVE_SLICES_SETTING)), context)
