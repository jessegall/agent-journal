from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.commands.claim_process.claim_process import ClaimProcess
from core.modules.processes.models.process import Process


class ClaimProcessHandler(Handler[ClaimProcess, Process]):
    """Writes when the run was claimed, refusing a second claim and a token the run was not prepared with;
    writes take turns, so of two runners only the first claims."""

    command = ClaimProcess

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ClaimProcess, context: Context) -> Process:
        process = self.queries.query(Process).find(command.process_id)
        if not process.claim_token or process.claim_token != command.token:
            raise Refusal(f"process {process.id} was not prepared with this token", "run the line the hook gave back")
        if process.claimed_at is not None:
            raise Refusal(f"process {process.id} was started already", "read its output with journal output read")
        return self.repository.save(process.changed(claimed_at=context.timestamp), context)
