from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.subcommand import Subcommand
from suites.coding.modules.workers.commands.short_proof.short_proof import ShortProof
from suites.coding.modules.workers.models.proof import Proof


class ShortProofSubcommand(Subcommand[ShortProof, Proof]):
    """`journal proof short <proof> "<what is missing>"`: the proof goes back to its worker."""

    cli_name = "proof"
    name = "short"
    outward = True

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("proof_id", type=int)
        parser.add_argument("shortfall")

    def command(self, arguments: Namespace, caller: Caller) -> ShortProof:
        return ShortProof(arguments.proof_id, arguments.shortfall)
