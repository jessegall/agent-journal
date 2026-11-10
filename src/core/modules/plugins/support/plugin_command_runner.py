import os
import subprocess
from pathlib import Path

from engine.agent.agent_checkouts import AgentCheckouts
from engine.caller.caller_request import SESSION_VARIABLE
from engine.checkout.checkout import Checkout
from engine.enums.checkout_type import CheckoutType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.driver.command_category import CommandCategory
from core.base.model.event_form import EventForm
from engine.file.project_reads import ProjectReads
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.process.plugin_script_processes import PluginScriptProcesses
from engine.enums.script_stop import ScriptStop
from core.modules.agents.models.agent import Agent
from core.modules.plugins.support.plugin_command_run import PluginCommandRun
from core.modules.processes.models.process import Process
from core.modules.processes.commands.stop_process.stop_process import StopProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import RunnerLine

RUN_LIMIT_SECONDS = 3600
RUN_KEY = "plugin run"


class PluginCommandRunner:
    """Runs a command in an agent's checkout without taking the agent's session."""

    def __init__(self, checkouts: AgentCheckouts, reads: ProjectReads, runner: RunnerBinary, scripts: PluginScriptProcesses, bus: Bus, queries: Queries) -> None:
        self.checkouts, self.reads, self.runner, self.scripts, self.bus, self.queries = checkouts, reads, runner, scripts, bus, queries

    def run(self, agent_id: int, line: str, is_readonly: bool, plugin: str, context: Context) -> PluginCommandRun:
        checkout = self.checkouts.checkout(agent_id)
        if not checkout.exists:
            raise Refusal(f"the checkout of agent {agent_id} was removed, so nothing can run in it", "read its files with journal plugin file --from base")
        if not self.runner.is_installed():
            raise Refusal(f"the journal has no runner at {self.runner.path}", "install it again")
        start = StartProcess.single_part(agent_id, line, str(checkout.root), CommandCategory.UNKNOWN, RUN_LIMIT_SECONDS, plugin)
        process = self.bus.run(start, context.actor, environment_id=self.queries.query(Agent).find(agent_id).environment_id)
        runner_line = RunnerLine.build(self.runner.path, process.id, self.foreground_run(checkout, is_readonly), line, "")
        running = subprocess.Popen(["sh", "-c", runner_line], cwd=checkout.root, env={name: value for name, value in os.environ.items() if name != SESSION_VARIABLE}, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                   text=True, start_new_session=True)
        self.scripts.start(running, plugin, RUN_KEY, EventForm.COMMIT, context.timestamp)
        try:
            output, _ = running.communicate()
            stopped = self.scripts.stop_reason(running) is not ScriptStop.STOP_FAILED
        finally:
            self.scripts.finish(running)
        if stopped and self.queries.query(Process).find(process.id).ended_at is None:
            self.bus.run(StopProcess(process.id), context.actor)
        return PluginCommandRun(process.id, running.returncode, output)

    def foreground_run(self, checkout: Checkout, is_readonly: bool) -> ForegroundRun:
        folder: Path | None = checkout.root if checkout.checkout_type is CheckoutType.WORKTREE and not is_readonly else None
        reads = self.reads.folders(checkout.project_root) if checkout.checkout_type is CheckoutType.WORKTREE else ()
        return ForegroundRun(RUN_LIMIT_SECONDS, False, queued=True, queue_wait_seconds=RUN_LIMIT_SECONDS, shell_sandbox=is_readonly or folder is not None, folder=folder, read_folders=reads)
