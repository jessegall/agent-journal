from argparse import REMAINDER, ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.helpers.commands.run_granted_command.run_granted_command import RunGrantedCommand
from core.modules.processes.models.process import Process
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch
from core.modules.processes.support.queued_process_start import QueuedProcessStart



class RunGrantedCommandSubcommand(Subcommand[RunGrantedCommand, Process]):
    """`journal helper run <program> ...`: runs what the helper was granted, in the background."""

    cli_name = "helper"
    name = "run"

    def __init__(self, launch: QueuedProcessLaunch, agents: AgentRows) -> None:
        self.launch, self.agents = launch, agents

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("command_parts", nargs=REMAINDER)

    def command(self, arguments: Namespace, caller: Caller) -> RunGrantedCommand:
        return RunGrantedCommand(tuple(arguments.command_parts))

    def write_output(self, value: object, output: Output) -> None:
        return None

    def after_listeners(self, value: object, output: Output) -> None:
        if not isinstance(value, Process):
            return
        session = self.agents.find(value.session_agent_id).session
        self.launch.start(QueuedProcessStart(value, value.line, session), ForegroundRun.queued_background())
        output.line(f"started in the background: output {value.id}")
