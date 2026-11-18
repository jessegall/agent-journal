from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.enums.actor_type import ActorType
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.helper_job_rows import HelperJobRows
from core.modules.helpers.commands.send_helper.send_helper import SendHelper
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.types.supervisor import Supervisor

SUPERVISORS_REASON = "the tick sends each kept supervisor its round, one supervisor an environment at most"
SUPERVISOR_ROUND = ("Your round: read journal overview and journal worker status. Merge the workers that asked, answer their "
                    "questions, check their proofs, send idle workers their next tasks and fix what holds them. Report and stop "
                    "when nothing waits.")


class SupervisorRound:
    """Every minute a kept supervisor that is not at work gets its round, while its environment has a worker's
    worktree open, so the workers keep going without the main agent."""

    def __call__(self, container: Container) -> None:
        queries = container.get(Queries)
        supervisors = queries.query(Agent).filter(role=Supervisor.key).matching(IsNull("retired_at")).every_row(SUPERVISORS_REASON)
        working = {worktree.environment_id for worktree in container.get(WorktreeQuery).open_worktrees()}
        for supervisor in supervisors:
            if supervisor.environment_id not in working or supervisor.ended_at is None or container.get(HelperJobRows).open_job(supervisor.id) is not None:
                continue
            with container.get(Scopes).row_scope(supervisor):
                main_agent = container.get(AgentRows).main_agent()
                if main_agent is None:
                    continue
                container.get(Bus).run(SendHelper(supervisor.id, SUPERVISOR_ROUND), Actor(main_agent.id, ActorType.AGENT), environment_id=supervisor.environment_id)
