from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.count_down import CountDown
from core.base.driver.times_span import TimesSpan
from core.base.refusal import Refusal
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.countdowns import Countdowns
from core.modules.settings.bindings.support.setting_values import SettingValues
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.commands.send_merge_findings.send_merge_findings import SendMergeFindings
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report import SendMergerReport
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merger_nudges import MERGER_FINDINGS_PREFIX
from suites.coding.modules.workers.support.worker_settings import DELIVERY_FAILURE_LIMIT

MERGE_REFUSAL_KEY = "workers.merge_refusal"
MERGE_REFUSAL_REPORT = "Worker {worker} was sent back {count} times in a row on one piece of work: it does not seem able to fix it."


class SendMergeFindingsHandler(Handler[SendMergeFindings, None]):
    """Sends what the merger found back to the worker that wrote the work. The main agent hears of it only when
    one worktree has been sent back as often as the setting says, since then the worker does not seem able to
    fix it; a new worktree starts the count again."""

    command = SendMergeFindings

    def __init__(self, agents: AgentRows, bus: Bus, worktrees: WorktreeQuery, countdowns: Countdowns, settings: SettingValues) -> None:
        self.agents, self.bus, self.worktrees, self.countdowns, self.settings = agents, bus, worktrees, countdowns, settings

    def handle(self, command: SendMergeFindings, context: Context) -> None:
        require_merger(self.agents, context)
        main_agent = self.agents.main_agent()
        if main_agent is None:
            raise Refusal("no main agent runs")
        self.bus.run(SendWorker(command.worker_id, f"{MERGER_FINDINGS_PREFIX}{command.findings}"),
                     Actor(main_agent.id, ActorType.AGENT), environment_id=context.environment_id)
        self.count_refusal(command.worker_id, context)

    def count_refusal(self, worker_id: int, context: Context) -> None:
        worktree = self.worktrees.worker_worktree(worker_id)
        if worktree is None:
            return
        limit = self.settings.number(DELIVERY_FAILURE_LIMIT)
        refusals = CountDown(MERGE_REFUSAL_KEY, "merge refusal", TimesSpan(limit), is_silent=True)
        if not self.countdowns.tick(refusals, worker_id, str(worktree.id), context):
            self.countdowns.reset(refusals, worker_id, context)
            self.bus.dispatch(SendMergerReport(MERGE_REFUSAL_REPORT.format(worker=worker_id, count=limit)), context)
