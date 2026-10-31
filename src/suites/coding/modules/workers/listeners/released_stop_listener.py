from core.base.change.change import Change
from core.base.command.bus import Bus
from core.base.driver.hook_event_name import HookEventName
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.agents.commands.end_agent import EndAgent
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_role import AgentRole
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.rules.repeated_stop_release_rule import STOP_REFUSAL_COUNT
from core.modules.tasks.queries.task_query import TaskQuery


class ReleasedStopListener(SaveListener):
    """A worker whose stop went through only by the repeated-stop release, its task still started, is ended."""

    name = "workers.released-stop"
    event = "hook_call.create"

    def __init__(self, queries: Queries, calls: HookCallQuery, tasks: TaskQuery, bus: Bus) -> None:
        self.queries, self.calls, self.tasks, self.bus = queries, calls, tasks, bus

    def handle(self, change: Change[Model]) -> None:
        call = change.row
        if not isinstance(call, HookCall) or call.hook != HookEventName.STOP or call.answer is not HookAnswer.ALLOWED:
            return
        if not self.queries.query(Agent).filter(id=call.agent_id, role=AgentRole.WORKER).exists() or not self.tasks.holder(call.agent_id).started().exists():
            return
        previous_stops = [stop for stop in self.calls.agent(call.agent_id).filter(hook=HookEventName.STOP).newest().page(1, STOP_REFUSAL_COUNT + 1).rows if stop.id != call.id]
        if len(previous_stops) >= STOP_REFUSAL_COUNT and all(stop.answer is HookAnswer.REFUSED for stop in previous_stops[:STOP_REFUSAL_COUNT]):
            self.bus.dispatch(EndAgent(call.agent_id), change.context)
