from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.query.queries import Queries
from core.modules.drivers.commands.report_safeguards_stop.report_safeguards_stop import ReportSafeguardsStop
from core.modules.drivers.commands.wake_safeguards_stopped_agent.wake_safeguards_stopped_agent import WakeSafeguardsStoppedAgent
from core.modules.drivers.commands.wake_safeguards_stopped_agent.wake_safeguards_stopped_agent_handler import WAKE_SOURCE
from core.modules.drivers.models.agent_line import AgentLine
from engine.enums.hook_answer import HookAnswer
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.support.safeguards_stop import SafeguardsStop


class SafeguardsStopRule(DriverRule):
    """A turn the model's safeguards ended with an API error wakes its agent once to go on with its work; when the
    next turn is ended the same way, the chat says so with the error's details and request id, and the agent is
    not woken again until a turn of it ends on its own."""

    name = "drivers.safeguards-stop"
    hook = HookEventName.STOP_FAILURE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.HELPER]

    def __init__(self, queries: Queries, hook_calls: HookCallQuery) -> None:
        self.queries, self.hook_calls = queries, hook_calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        stop = SafeguardsStop.of(hook.event)
        if stop is None:
            return RuleAnswer.allowed()
        if self.is_woken_without_a_finished_turn(hook.agent_id):
            return RuleAnswer.allowed().running(ReportSafeguardsStop(hook.agent_id, stop.details, stop.request_id))
        return RuleAnswer.allowed().running(WakeSafeguardsStoppedAgent(hook.agent_id))

    def is_woken_without_a_finished_turn(self, agent_id: int) -> bool:
        wake = self.queries.query(AgentLine).filter(session_agent_id=agent_id, source=WAKE_SOURCE).newest().first()
        if wake is None:
            return False
        stop = self.hook_calls.agent(agent_id).filter(hook=HookEventName.STOP, answer=HookAnswer.ALLOWED).newest().first()
        return stop is None or stop.creation_timestamp().value <= wake.creation_timestamp().value
