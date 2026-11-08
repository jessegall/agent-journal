from core.base.chat.mark_outcome import MarkOutcome
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.hook_timeouts import HookTimeouts
from core.base.driver.rule_timings import RuleTimings
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.drivers.models.enums.bypass_mark_type import BypassMarkType
from core.modules.drivers.models.enums.bypass_mark_variant import BypassMarkVariant
from core.modules.drivers.commands.record_hook_timeout.record_hook_timeout import RecordHookTimeout
from core.modules.drivers.support.driver_nudges import HOOKS_TIMED_OUT
from core.modules.drivers.support.driver_settings import MODULE_KEY
from core.modules.drivers.support.nudger import Nudger

LINE_SOURCE = "drivers.hook-timeouts"
UNTIMED_RULE = "none timed"


class RecordHookTimeoutHandler(Handler[RecordHookTimeout, None]):
    """Counts an agent's hook timeouts, and when it had three in ten minutes tells its main agent in one line naming the agent
    and the slowest rule, and shows the same once in the person's chat."""

    command = RecordHookTimeout

    def __init__(self, timeouts: HookTimeouts, timings: RuleTimings, nudger: Nudger, bus: Bus, actors: ModuleActors, queries: Queries) -> None:
        self.timeouts, self.timings, self.nudger, self.bus, self.actors, self.queries = timeouts, timings, nudger, bus, actors, queries

    def handle(self, command: RecordHookTimeout, context: Context) -> None:
        count = self.timeouts.record(command.agent_id, context.timestamp)
        if not self.timeouts.is_due(command.agent_id, count, context.timestamp):
            return None
        self.timeouts.tell(command.agent_id, context.timestamp)
        main = MainAgentFinder.newest(self.queries)
        receiver = main.id if main is not None else command.agent_id
        rule = self.timings.slowest(command.agent_id) or UNTIMED_RULE
        self.nudger.send(receiver, HOOKS_TIMED_OUT, LINE_SOURCE, context, agent=command.agent_id, count=count)
        text = f"Agent {command.agent_id}: {count} hook timeouts in ten minutes, slowest rule {rule}"
        self.bus.run(ShowMark(BypassMarkType.BYPASS, BypassMarkVariant.TIMEOUTS, f"hook-timeouts:{command.agent_id}:{context.timestamp.text}", text, agent_id=receiver,
                              outcome=MarkOutcome.FAILED, ended=True), self.actors.actor(MODULE_KEY), environment_id=context.environment_id)
