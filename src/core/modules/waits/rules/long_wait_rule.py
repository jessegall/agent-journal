from core.base.clock import Clock
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.queries import Queries
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.wait import Wait
from core.modules.waits.support.wait_nudges import WAIT_CHECK

LONG_WAIT_MINUTES = 10
MINUTE_SECONDS = 60


class LongWaitRule(DriverRule):
    """A tick that finds an agent's wait open for ten minutes or more tells it to check on what it waits for."""

    name = "waits.long-wait"
    hook = HookEventName.TICK

    def __init__(self, queries: Queries, clock: Clock) -> None:
        self.queries, self.clock = queries, clock

    def answer(self, hook: AgentHook) -> RuleAnswer:
        current_time = self.clock.timestamp()
        nudges: list[Nudge] = []
        for wait in self.queries.query(Wait).filter(agent_id=hook.agent_id, state=WaitState.OPEN).all_rows():
            minutes = int(wait.opened_at.elapsed_seconds(current_time) / MINUTE_SECONDS)
            if minutes >= LONG_WAIT_MINUTES:
                nudges.append(WAIT_CHECK.nudge(minutes=minutes, focus=wait.focus))
        return RuleAnswer.with_nudges(*nudges) if nudges else RuleAnswer.allowed()
