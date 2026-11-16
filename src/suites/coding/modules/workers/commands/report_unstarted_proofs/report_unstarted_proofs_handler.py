from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.prefix import Prefix
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.chat.models.journal_exception import JournalException
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.commands.report_unstarted_proofs.report_unstarted_proofs import SOURCE_KEY_PREFIX, ReportUnstartedProofs
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.agent_messages.unstarted_proofs_message import UnstartedProofsMessage
from suites.coding.modules.workers.tick_handlers.stalled_worker_test_runs_tick_handler import StalledWorkerTestRunsTickHandler

UNSTARTED_PROOF_SECONDS = 180
ERROR_FREE = "no error was logged"
RECENT_EXCEPTIONS = 50
REPORTED_REASON = "the lines that already told the main agent about a set of unstarted proofs are read once"


class ReportUnstartedProofsHandler(Handler[ReportUnstartedProofs, None]):
    """Tells the main agent, once for each set of proofs, that proofs have waited queued for three minutes with no
    test running in their worktree, naming them and the last error of the tick that starts them."""

    command = ReportUnstartedProofs
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, proofs: ProofQuery, repository: Repository, main_line: MainAgentLine) -> None:
        self.queries, self.proofs, self.repository, self.main_line = queries, proofs, repository, main_line

    def handle(self, command: ReportUnstartedProofs, context: Context) -> None:
        rows = self.proofs.test_rows()
        running = {proof.worktree_id for proof in rows if proof.state is ProofState.RUNNING}
        unstarted = sorted(proof.id for proof in rows if proof.state is ProofState.QUEUED and proof.worktree_id not in running
                           and proof.update_timestamp().elapsed_seconds(context.timestamp) >= UNSTARTED_PROOF_SECONDS)
        source_key = f"{SOURCE_KEY_PREFIX}{','.join(map(str, unstarted))}"
        if not unstarted or self.is_reported(source_key):
            return
        agent_message = UnstartedProofsMessage.declared().agent_message(proofs=", ".join(map(str, unstarted)), minutes=UNSTARTED_PROOF_SECONDS // 60, exception=self.last_error())
        self.repository.save(MergerLine(text=agent_message.text, fallback_source=UnstartedProofsMessage.declared().key, agent_message_json=agent_message.stored.json, source_key=source_key, read_at=context.timestamp), context)
        self.main_line.send_agent_message(agent_message, UnstartedProofsMessage.declared().key, context)

    def is_reported(self, source_key: str) -> bool:
        reported = self.queries.query(MergerLine).matching(Prefix("source_key", SOURCE_KEY_PREFIX)).every_row(REPORTED_REASON)
        return any(line.source_key == source_key for line in reported)

    def last_error(self) -> str:
        newest = self.queries.query(JournalException).newest().take(RECENT_EXCEPTIONS)
        return next((row.message for row in newest if row.source == StalledWorkerTestRunsTickHandler.name), ERROR_FREE)
