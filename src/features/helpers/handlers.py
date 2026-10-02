from engine.events.resources import AgentChanged
from features.helpers.controller import Helpers
from features.parts import AgentContext, Handler, OnAgentUpdated
from resources.base import SYSTEM
from resources.types import FAILED


class TellAFailedTurn(Handler):
    def handle(self, context: AgentContext, event: AgentChanged) -> None:
        row = context.agent.row
        if row.event == FAILED:
            Helpers(context.record, actor=SYSTEM)._failed(row.failure)


class TellAFailedTurnOnChange(OnAgentUpdated, TellAFailedTurn):
    pass
