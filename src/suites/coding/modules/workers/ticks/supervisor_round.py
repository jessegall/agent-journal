from datetime import timedelta

from engine.actor.actor import Actor
from engine.time.clock import Clock
from suites.coding.modules.workers.support.merger_work import MergerWork
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
# with nothing waiting, a supervisor gets its round this long after its last session ended at the soonest
QUIET_GAP = timedelta(minutes=15)
SUPERVISOR_ROUND = ("Your round: read journal overview and journal worker status. Merge the workers that asked, answer their "
                    "questions, check their proofs, send idle workers their next tasks and fix what holds them. Report and stop "
                    "when nothing waits.")


class SupervisorRound:
    """A kept supervisor that is not at work gets its round while its environment has a worker's worktree open:
    at once when a worker's merge ask or question waits for it, otherwise fifteen minutes after its last session
    ended at the soonest, so it keeps the workers going without starting a session every minute."""

    def __call__(self, container: Container) -> None:
        queries = container.get(Queries)
        supervisors = queries.query(Agent).filter(role=Supervisor.key).matching(IsNull("retired_at")).every_row(SUPERVISORS_REASON)
        working = {worktree.environment_id for worktree in container.get(WorktreeQuery).open_worktrees()}
        for supervisor in supervisors:
            if supervisor.environment_id not in working or supervisor.ended_at is None or container.get(HelperJobRows).open_job(supervisor.id) is not None:
                continue
            with container.get(Scopes).row_scope(supervisor):
                main_agent = container.get(AgentRows).main_agent()
                if main_agent is None or not self.is_due(container, supervisor):
                    continue
                container.get(Bus).run(SendHelper(supervisor.id, SUPERVISOR_ROUND), Actor(main_agent.id, ActorType.AGENT), environment_id=supervisor.environment_id)

    @staticmethod
    def is_due(container: Container, supervisor: Agent) -> bool:
        if container.get(MergerWork).has_waiting_work():
            return True
        return supervisor.ended_at is None or container.get(Clock).timestamp().value - supervisor.ended_at.value >= QUIET_GAP
