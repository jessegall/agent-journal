from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.commands.switch_worker_sandbox.switch_worker_sandbox import SwitchWorkerSandbox

SANDBOX_CHOICES = {"on": True, "off": False}


class SwitchWorkerSandboxSubcommand(Subcommand[SwitchWorkerSandbox, Agent]):
    """`journal worker sandbox <n> on|off`: the worker runs its shell lines in the sandbox or not."""

    cli_name = "worker"
    name = "sandbox"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("worker_id", type=int)
        parser.add_argument("choice", choices=sorted(SANDBOX_CHOICES))

    def command(self, arguments: Namespace, caller: Caller) -> SwitchWorkerSandbox:
        return SwitchWorkerSandbox(arguments.worker_id, SANDBOX_CHOICES[arguments.choice])
