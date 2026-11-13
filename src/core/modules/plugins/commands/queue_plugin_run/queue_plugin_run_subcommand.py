import shlex
from argparse import ArgumentParser, Namespace

from engine.caller.caller import Caller
from engine.cli.errors.usage_error import UsageError
from engine.errors.refusal import Refusal
from engine.subcommand.output import Output
from engine.subcommand.subcommand import SUCCESS_CODE, Subcommand
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.plugins.commands.queue_plugin_run.queue_plugin_run import QueuePluginRun
from core.modules.plugins.support.plugin_call_access import PluginCallAccess
from core.modules.plugins.support.queued_run_follow import QueuedRunFollow
from core.modules.plugins.support.queued_run_start import QueuedRunStart
from core.modules.processes.models.enums.queue_priority import QueuePriority
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.queued_process_launch import QueuedProcessLaunch
from core.modules.processes.support.queued_process_start import QueuedProcessStart



class QueuePluginRunSubcommand(Subcommand[QueuePluginRun, QueuedRunStart]):
    """`journal plugin queue <plugin> --kind <kind> -- <command>`: queues the command under the plugin's kind,
    in an agent's checkout or a named folder. It waits for the run and prints its lines, ending with its exit
    code, or with --detach prints the run's number at once."""

    cli_name = "plugin"
    name = "queue"
    outward = True

    def __init__(self, access: PluginCallAccess, agents: AgentRows, launch: QueuedProcessLaunch, follow: QueuedRunFollow) -> None:
        self.access, self.agents, self.launch, self.follow = access, agents, launch, follow

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("plugin")
        parser.add_argument("--kind", required=True)
        place = parser.add_mutually_exclusive_group()
        place.add_argument("--agent", type=int)
        place.add_argument("--checkout", default="")
        parser.add_argument("--timeout", type=int, default=0)
        parser.add_argument("--priority", choices=[priority.value for priority in QueuePriority], default=QueuePriority.NORMAL.value)
        parser.add_argument("--detach", action="store_true")
        parser.add_argument("line", nargs="*")

    def command(self, arguments: Namespace, caller: Caller) -> QueuePluginRun:
        if self.access.is_limited(caller):
            raise Refusal("an agent may not use journal plugin queue", "run the command in your own shell")
        if caller.plugin_script and caller.plugin_script != arguments.plugin:
            raise Refusal(f"plugin {caller.plugin_script} may queue only its own runs, not those of {arguments.plugin}")
        terms = arguments.line
        if not terms:
            raise UsageError("name the command to run after --")
        timeouts = tuple([f"{arguments.timeout}s"]) if arguments.timeout > 0 else ()
        return QueuePluginRun(arguments.plugin, arguments.kind, self.agent_id(arguments, caller), arguments.checkout, shlex.join(terms), timeouts,
                              QueuePriority(arguments.priority), arguments.detach)

    def agent_id(self, arguments: Namespace, caller: Caller) -> int:
        if arguments.agent is not None or not arguments.checkout:
            return self.access.agent_id(arguments.agent, caller)
        main = None if caller.environment_id is None else self.agents.environment_main_agent(caller.environment_id)
        if main is None:
            raise Refusal("this environment has no running main agent to run the command for", "name one with --agent <n>")
        return main.id

    def write_output(self, value: object, output: Output) -> None:
        return None

    def after_listeners(self, value: object, output: Output) -> int:
        if not isinstance(value, QueuedRunStart):
            return SUCCESS_CODE
        if not value.is_joined:
            session = self.agents.find(value.process.session_agent_id).session
            self.launch.start(QueuedProcessStart(value.process, value.process.line, session), ForegroundRun.queued_background())
        if value.is_detached:
            output.write(f"run {value.run.id}", {"run": value.run.id, "output": value.process.id, "joined": value.is_joined})
            return SUCCESS_CODE
        return self.follow.exit_code(value.process.id, output)
