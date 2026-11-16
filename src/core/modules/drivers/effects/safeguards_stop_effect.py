from engine.command.command import Command
from collections.abc import Sequence
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_effect import EventEffect
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.query.queries import Queries
from core.modules.drivers.commands.report_safeguards_stop.report_safeguards_stop import ReportSafeguardsStop
from core.modules.drivers.commands.wake_safeguards_stopped_agent.wake_safeguards_stopped_agent import WakeSafeguardsStoppedAgent
from core.modules.drivers.commands.wake_safeguards_stopped_agent.wake_safeguards_stopped_agent_handler import WAKE_SOURCE
from core.modules.drivers.models.agent_line import AgentLine
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.safeguards_stop import SafeguardsStop


class SafeguardsStopEffect(EventEffect):
    """A turn the model's safeguards ended with an API error wakes its agent once to go on with its work; when
    the next turn is ended the same way, the chat says so with the error's details and request id, and the
    agent is not woken again until a turn of it ends on its own."""

    key = "drivers.safeguards-stop"
    events = [HookEventName.STOP_FAILURE]
    agent_types = [AgentRole.MAIN.value, AgentRole.HELPER.value]

    def __init__(self, queries: Queries, hook_calls: HookCallQuery) -> None:
        self.queries, self.hook_calls = queries, hook_calls

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        stop = SafeguardsStop.read(event)
        if stop is None:
            return []
        if self.is_awakened_mid_turn(agent_id):
            return [ReportSafeguardsStop(agent_id, stop.details, stop.request_id)]
        return [WakeSafeguardsStoppedAgent(agent_id)]

    def is_awakened_mid_turn(self, agent_id: int) -> bool:
        wake = self.queries.query(AgentLine).filter(session_agent_id=agent_id, source=WAKE_SOURCE).newest().first()
        if wake is None:
            return False
        stop = self.hook_calls.agent(agent_id).filter(hook=HookEventName.STOP, answer=HookAnswer.ALLOWED).newest().first()
        return stop is None or stop.creation_timestamp().value <= wake.creation_timestamp().value
