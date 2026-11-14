from engine.event.changed import Changed
from engine.event.deleted import Deleted
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.proof_query import ProofQuery


class WorkerProofRowsListener(SaveListener[Changed[Proof]]):
    name = "workers.proof-rows"

    def __init__(self, proofs: ProofQuery) -> None:
        self.proofs = proofs

    def handle(self, event: Changed[Proof], context: Context) -> None:
        if isinstance(event, Deleted):
            self.proofs.remove_test(event.row)
            return
        self.proofs.remember_test(event.row)
