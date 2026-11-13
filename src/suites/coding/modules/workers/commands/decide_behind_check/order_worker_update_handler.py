from engine.actor.actor import Actor
from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudger import Nudger
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows
from suites.coding.modules.workers.commands.decide_behind_check.order_worker_update import OrderWorkerUpdate
from suites.coding.modules.workers.commands.merger.require_merger import require_merger_or_main_agent
from engine.errors.refusal import Refusal
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.support.behind_decisions import WITHOUT_OPEN_CHECK, BehindDecisions
from suites.coding.modules.workers.support.behind_facts_reader import BehindFactsReader
from suites.coding.modules.workers.support.behind_nudges import BEHIND_SOURCE, UPDATE_ORDERED
from suites.coding.modules.workers.support.merger_visits import MergerVisits


class OrderWorkerUpdateHandler(Handler[OrderWorkerUpdate, None]):
    """Orders the update: reads how far the worktree is behind before the transaction opens, since git runs,
    moves the check to ordered with who and why, closes the merger visit so the handled line does not come
    back, and wakes the worker in its session with what moved and what to run. The main agent may order a
    worker with no check open, which opens one."""

    command = OrderWorkerUpdate
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, decisions: BehindDecisions, reader: BehindFactsReader, queries: Queries, repository: Repository, visits: MergerVisits, nudger: Nudger) -> None:
        self.agents, self.decisions, self.reader, self.queries, self.repository, self.visits, self.nudger = agents, decisions, reader, queries, repository, visits, nudger
        self.behind, self.tip = 0, ""

    def opened(self, worktree: Worktree, deciding_id: int, context: Context) -> WorktreeBehindCheck:
        if not self.agents.is_main(deciding_id):
            raise Refusal(WITHOUT_OPEN_CHECK, "journal merger behind <worker> shows how far it is behind")
        return self.repository.save(WorktreeBehindCheck.opened(worktree.id, self.tip, self.behind), context)

    def prepare(self, command: OrderWorkerUpdate, actor: Actor) -> None:
        worktree = self.decisions.worktree(command.worker_id)
        facts = self.reader.read(worktree, self.queries.query(Agent).find(command.worker_id))
        self.behind, self.tip = facts.behind, facts.base_tip

    def handle(self, command: OrderWorkerUpdate, context: Context) -> None:
        deciding = require_merger_or_main_agent(self.agents, context)
        worktree = self.decisions.worktree(command.worker_id)
        check = self.decisions.check(worktree, WorktreeBehindCheck.open_for_decision) or self.opened(worktree, deciding.id, context)
        self.repository.save_change(check, check.ordered(deciding.id, command.why), context)
        self.visits.close_newest(context)
        self.nudger.send(worktree.session_agent_id, UPDATE_ORDERED, BEHIND_SOURCE, context, count=check.behind)
