from core.modules.processes.support.run_count_lines import RunCountLines
from dataclasses import replace

from core.modules.processes.support.process_nudges import RUNNER_MISSING, SANDBOX_RUNNER_MISSING, SANDBOX_PARSE_ERROR, SANDBOX_FOLDER_MISSING
from collections.abc import Mapping, Sequence

from engine.driver.agent_hook import AgentHook
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.enums.access import Access
from engine.agent.agent_checkouts import AgentCheckouts
from engine.sandbox.agent_sandbox_choice import AgentSandboxChoice
from engine.agent.agent_write_folder import AgentWriteFolder
from engine.file.project_reads import ProjectReads
from engine.sandbox.shell_sandbox import ShellSandbox
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.hook_history import HookHistory
from engine.driver.rule_answer import RuleAnswer
from engine.driver.shell_line import ShellLine
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.process import Process
from core.modules.processes.support.foreground_limit import ForegroundLimit
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import RunnerLine

BACKGROUND_FLAG = "run_in_background"


class RunnerRewriteRule(DriverRule):
    """A shell line of any agent runs through the journal's runner: the run is made a process, split into its
    parts, and the agent's command is rewritten to hand the runner its process, its limit and its line. The
    line stays as written, a read's pipes too; only a test run or a build shows a mark or a card."""

    name = "processes.runner-rewrite"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    history = True
    overlay_proof = True
    refuses_one_action = "A shell line of any agent runs through the journal's runner"

    def __init__(self, limits: ForegroundLimit, runner: RunnerBinary, hook_history: HookHistory, count_lines: RunCountLines, types: HelperTypeBook, folders: AgentWriteFolder, shell_sandbox: ShellSandbox, project_reads: ProjectReads, checkouts: AgentCheckouts, choice: AgentSandboxChoice) -> None:
        self.limits, self.runner, self.hook_history, self.count_lines = limits, runner, hook_history, count_lines
        self.types = types
        self.folders = folders
        self.shell_sandbox = shell_sandbox
        self.project_reads, self.checkouts = project_reads, checkouts
        self.choice = choice

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None:
            return RuleAnswer.allowed()
        agent_type = self.types.find(hook.role)
        sandbox = self.shell_sandbox.is_required and (agent_type.access is Access.READ or agent_type.separate_folder) and self.choice.sandboxed(hook.agent_id)
        if shell.parse_error:
            if sandbox:
                return RuleAnswer.refused(SANDBOX_PARSE_ERROR.nudge())
            return RuleAnswer.allowed()
        if not self.runner.is_installed():
            if sandbox:
                return RuleAnswer.refused(SANDBOX_RUNNER_MISSING.nudge())
            return self.missing(hook)
        decided = self.limits.decide(shell, hook.agent_id)
        folder = self.folders.folder(hook.agent_id) if sandbox and agent_type.separate_folder and agent_type.access is Access.WRITING else None
        if sandbox and agent_type.separate_folder and agent_type.access is Access.WRITING and folder is None:
            return RuleAnswer.refused(SANDBOX_FOLDER_MISSING.nudge())
        read_folders = self.project_reads.folders(self.checkouts.checkout(hook.agent_id).project_root) if folder is not None else ()
        run = replace(decided, read_command=shell.is_readonly, shell_sandbox=sandbox, folder=folder, read_folders=read_folders)
        return RuleAnswer.allowed().running(StartProcess.build(hook, shell, run)).rewriting_after_commands(lambda results: self.tool_input(hook, shell, run, results))

    def tool_input(self, hook: AgentHook, shell: ShellLine, run: ForegroundRun, results: Sequence[object]) -> Mapping[str, object]:
        process = next((made for made in results if isinstance(made, Process)), None)
        if process is None:
            return {}
        run = self.count_lines.counted(run, process)
        kept = {str(field): value for field, value in hook.event.tool_input().items() if field != BACKGROUND_FLAG}
        return {**kept, "command": RunnerLine.build(self.runner.path, process.id, run, shell.runner_text, hook.event.session)}

    def missing(self, hook: AgentHook) -> RuleAnswer:
        if self.hook_history.last_answer(self.name, hook) is not None:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(RUNNER_MISSING.nudge(folder=self.runner.path.parent))
