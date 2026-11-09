from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.commands.ask_main_agent.ask_main_agent import AskMainAgent
from suites.coding.modules.workers.commands.send_merger_report.send_merger_report import SendMergerReport
from suites.coding.modules.workers.support.worker_ask_facts_query import WorkerAskFactsQuery
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.merger_visits import MergerVisits


class AskMainAgentHandler(Handler[AskMainAgent, None]):
    """Writes the merger's question as one message to the main agent, with the facts of a worker it names."""

    command = AskMainAgent
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, guidance: WorkerGuidance, facts_query: WorkerAskFactsQuery, bus: Bus, visits: MergerVisits) -> None:
        self.agents, self.guidance, self.facts_query, self.bus, self.visits = agents, guidance, facts_query, bus, visits

    def handle(self, command: AskMainAgent, context: Context) -> None:
        require_merger(self.agents, context)
        self.visits.close_newest(context)
        options = " ".join(f"{number}) {option}" for number, option in enumerate(command.options, start=1))
        parts = [f"What: {command.problem}", f"Tried: {command.tried}", f"Options: {options}", f"Recommendation: {command.recommendation}"]
        self.bus.dispatch(SendMergerReport("\n".join([*parts, *self.worker_lines(command.worker_id)])), context)

    def worker_lines(self, worker_id: int | None) -> list[str]:
        if worker_id is None:
            return []
        point = self.guidance.point(worker_id)
        if point.round.has_no_work():
            return []
        return [self.facts_query.read(point).text()]
