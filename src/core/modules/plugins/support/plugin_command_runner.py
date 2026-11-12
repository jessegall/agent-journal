import os
import subprocess
from pathlib import Path

from engine.agent.agent_checkouts import AgentCheckouts
from engine.caller.caller_request import SESSION_VARIABLE
from engine.checkout.checkout import Checkout
from engine.command.bus import Bus
from engine.command.context import Context
from engine.enums.command_category import CommandCategory
from engine.enums.event_form import EventForm
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
from core.modules.agents.support.agent_label import AgentLabel
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest

RUN_LIMIT_SECONDS = 3600
RUN_KEY = "plugin run"


class PluginCommandRunner:
    """Runs a command in an agent's checkout without taking the agent's session; a run of a kind the plugin's
    manifest declares is queued under that kind and its category."""

    def __init__(self, checkouts: AgentCheckouts, reads: ProjectReads, runner: RunnerBinary, scripts: PluginScriptProcesses, bus: Bus, queries: Queries, folders: PluginFolders) -> None:
        self.checkouts, self.reads, self.runner, self.scripts, self.bus, self.queries = checkouts, reads, runner, scripts, bus, queries
        self.folders = folders

    def run(self, agent_id: int, line: str, is_readonly: bool, plugin: str, context: Context, kind: str = "") -> PluginCommandRun:
        checkout = self.checkouts.checkout(agent_id)
        if not checkout.exists:
            raise Refusal(f"the checkout of {AgentLabel.from_agent(self.queries.query(Agent).find(agent_id)).text} was removed, so nothing can run in it", "read its files with journal plugin file --from base")
        if not self.runner.is_installed():
            raise Refusal(f"the journal has no runner at {self.runner.path}", "install it again")
        start = StartProcess.single_part(agent_id, line, str(checkout.root), self.category(plugin, kind), RUN_LIMIT_SECONDS, plugin, kind)
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

    def category(self, plugin: str, kind: str) -> CommandCategory:
        if not kind:
            return CommandCategory.UNKNOWN
        declared = PluginManifest.read(self.folders.code(plugin)).process_kind(kind)
        if declared is None:
            raise Refusal(f"plugin {plugin} declares no kind of run named {kind}", "name a kind its manifest lists under processes")
        return declared.category

    def foreground_run(self, checkout: Checkout, is_readonly: bool) -> ForegroundRun:
        folder: Path | None = checkout.root if checkout.checkout_type.is_separate_copy and not is_readonly else None
        reads = self.reads.folders(checkout.project_root) if checkout.checkout_type.is_separate_copy else ()
        return ForegroundRun(RUN_LIMIT_SECONDS, False, queued=True, queue_wait_seconds=RUN_LIMIT_SECONDS, shell_sandbox=is_readonly or folder is not None, folder=folder, read_folders=reads)
