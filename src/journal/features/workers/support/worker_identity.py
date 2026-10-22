from journal.repositories.workers import Workers
from journal.support.caller_variables import CallerVariables
from journal.support.worker_token import WorkerToken

REFUSAL = "this shell says it is a worker's but does not carry that worker's token: the journal takes nothing from it\n"


class WorkerIdentity:
    """Checks that a command, a shell line or a hook that says it is a worker's carries that worker's token; a shell marked as a worker's that names no worker is refused too, and a worker row from before tokens passes as it did."""

    def __init__(self, workers: Workers) -> None:
        self.workers = workers

    def is_proven(self, variables: CallerVariables) -> bool:
        if variables.worker is None:
            return not variables.worker_shell
        return self.is_token(variables.worker, variables.worker_token)

    def is_token(self, number: int, token: str | None) -> bool:
        rows = self.workers.global_matching(id=number)
        if not rows:
            return False
        return not rows[0].token_hash or WorkerToken.is_proof(token, rows[0].token_hash)
