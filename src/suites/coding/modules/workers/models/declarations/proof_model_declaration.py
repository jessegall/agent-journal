from engine.module.model_declaration import ModelDeclaration
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.proof_query import ProofQuery


class ProofModelDeclaration(ModelDeclaration):
    """How the module declares Proof."""

    model = Proof
    query = ProofQuery
    excluded_subcommands = ["make", "edit", "delete", "revise", *[move.name for move in ProofLifecycle.moves() if not move.has_command]]
