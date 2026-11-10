from engine.cli.row_numbers import RowNumbers
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.hook_timeouts import HookTimeouts
from engine.driver.rule_timings import RuleTimings
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.support.main_agent_finder import MainAgentFinder
from core.modules.drivers.models.hook_timeout_notice import HookTimeoutNotice
from core.modules.drivers.commands.record_hook_timeout.record_hook_timeout import RecordHookTimeout
from core.modules.drivers.support.driver_nudges import HOOK_TIMEOUTS
from engine.driver.nudger import Nudger

LINE_SOURCE = "drivers.hook-timeouts"
UNTIMED_RULE = "none timed"


class RecordHookTimeoutHandler(Handler[RecordHookTimeout, None]):
    """Counts an agent's hook timeouts, and when it had three in ten minutes tells its main agent in one line
    naming the agent and the slowest rule, and records the notice the chat shows once."""

    command = RecordHookTimeout

    def __init__(self, timeouts: HookTimeouts, timings: RuleTimings, nudger: Nudger, repository: Repository, queries: Queries, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.timeouts, self.timings, self.nudger, self.repository, self.queries = timeouts, timings, nudger, repository, queries

    def handle(self, command: RecordHookTimeout, context: Context) -> None:
        count = self.timeouts.record(command.agent_id, context.timestamp)
        if not self.timeouts.needs_notice(command.agent_id, count, context.timestamp):
            return None
        self.timeouts.notify(command.agent_id, context.timestamp)
        main = MainAgentFinder.newest(self.queries)
        receiver = main.id if main is not None else command.agent_id
        rule = self.timings.slowest(command.agent_id) or UNTIMED_RULE
        self.nudger.send(receiver, HOOK_TIMEOUTS, LINE_SOURCE, context, agent=self.numbers.number(AGENT_MODEL_NAME, command.agent_id), count=count)
        self.repository.save(HookTimeoutNotice(session_agent_id=command.agent_id, receiver_id=receiver, timeout_count=count, slowest_rule=rule), context)
