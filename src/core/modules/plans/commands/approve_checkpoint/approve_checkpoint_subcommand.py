from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.subcommand.output import Output
from engine.subcommand.subcommand import Subcommand
from core.modules.plans.commands.approve_checkpoint.approve_checkpoint import ApproveCheckpoint


class ApproveCheckpointSubcommand(Subcommand[ApproveCheckpoint, int]):
    """`journal plan approve-checkpoint <plan> <phase>`: a person lets the phases after a checkpoint open, when the
    checkpoint's tests passed and the setting to wait for the person is on."""

    cli_name = "plan"
    name = "approve-checkpoint"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plan_id", type=int)
        parser.add_argument("phase_id", type=int)

    def command(self, arguments: Namespace, caller: Caller) -> ApproveCheckpoint:
        return ApproveCheckpoint(arguments.plan_id, arguments.phase_id)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, int):
            output.line(f"checkpoint phase {value} approved")
