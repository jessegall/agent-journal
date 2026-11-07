from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.commands.send_merge_findings.send_merge_findings import SendMergeFindings
from suites.coding.modules.workers.commands.merger.require_merger import require_merger


class SendMergeFindingsHandler(Handler[SendMergeFindings, None]):
    """Sends the findings on a merge back to the worker that wrote the work."""

    command = SendMergeFindings
    transactional = False

    def __init__(self, agents: AgentRows, bus: Bus) -> None:
        self.agents, self.bus = agents, bus

    def handle(self, command: SendMergeFindings, context: Context) -> None:
        require_merger(self.agents, context)
        main_agent = self.agents.main_agent()
        if main_agent is None:
            raise Refusal("no main agent runs")
        self.bus.run(SendWorker(command.worker_id, f"Findings from the judge on your merged work, please fix them: {command.findings}"),
                     Actor(main_agent.id, ActorType.AGENT), environment_id=context.environment_id)
