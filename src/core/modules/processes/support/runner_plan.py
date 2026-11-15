from dataclasses import dataclass, replace

from engine.agent.agent_checkouts import AgentCheckouts
from engine.agent.agent_role_reader import AgentRoleReader
from engine.agent.agent_write_folder import AgentWriteFolder
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.driver.shell_line import ShellLine
from engine.enums.access import Access
from engine.file.project_reads import ProjectReads
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.request.request_values import RequestValues
from engine.sandbox.agent_sandbox_choice import AgentSandboxChoice
from engine.sandbox.shell_sandbox import ShellSandbox
from core.modules.processes.agent_messages.sandbox_folder_missing_message import SandboxFolderMissingMessage
from core.modules.processes.agent_messages.sandbox_parse_error_message import SandboxParseErrorMessage
from core.modules.processes.agent_messages.sandbox_runner_missing_message import SandboxRunnerMissingMessage
from core.modules.processes.support.foreground_limit import ForegroundLimit
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_binary import RunnerBinary

RUNNER_REWRITE_KEY = "processes.runner-rewrite"


@dataclass(frozen=True)
class RunnerDecision:
    """How the runner takes a shell line: refused, with the sandbox line that says why; run as written, because the
    runner is not installed; or run through the runner, with the run it is given."""

    refusal: AgentMessage | None = None
    runner_missing: bool = False
    run: ForegroundRun | None = None
    shell: ShellLine | None = None


class RunnerPlan:
    """A shell line of any agent runs through the journal's runner: the run is made a process, split into its parts,
    and the agent's command is rewritten to hand the runner its process, its limit and its line. A read-only or
    separate-folder helper that runs in the sandbox is refused a line that cannot be parsed, a missing runner, or a
    missing write folder. Read once a hook, so the policy, the line and the start agree."""

    def __init__(self, limits: ForegroundLimit, runner: RunnerBinary, types: HelperTypeBook, roles: AgentRoleReader, folders: AgentWriteFolder, shell_sandbox: ShellSandbox,
                 project_reads: ProjectReads, checkouts: AgentCheckouts, choice: AgentSandboxChoice, request_values: RequestValues) -> None:
        self.limits, self.runner, self.types, self.roles, self.folders = limits, runner, types, roles, folders
        self.shell_sandbox, self.project_reads, self.checkouts, self.choice, self.request_values = shell_sandbox, project_reads, checkouts, choice, request_values

    def decision(self, shell: ShellLine | None, firing: str, agent_id: int) -> RunnerDecision:
        if shell is None:
            return RunnerDecision()
        return self.request_values.read(f"processes.runner:{agent_id}:{firing}:{shell.runner_text}", lambda: firing, lambda: self.decided(shell, agent_id))

    def of_event(self, event: HookEvent, agent_id: int) -> RunnerDecision:
        return self.decision(event.tool.shell if event.tool is not None else None, event.firing, agent_id)

    def decided(self, shell: ShellLine, agent_id: int) -> RunnerDecision:
        agent_type = self.types.find(self.roles.role(agent_id))
        sandbox = self.shell_sandbox.is_required and (agent_type.access is Access.READ or agent_type.separate_folder) and self.choice.sandboxed(agent_id)
        if shell.parse_error:
            return RunnerDecision(SandboxParseErrorMessage.declared().agent_message()) if sandbox else RunnerDecision()
        if not self.runner.is_installed():
            return RunnerDecision(SandboxRunnerMissingMessage.declared().agent_message()) if sandbox else RunnerDecision(runner_missing=True)
        writes_apart = sandbox and agent_type.separate_folder and agent_type.access is Access.WRITING
        folder = self.folders.folder(agent_id) if writes_apart else None
        if writes_apart and folder is None:
            return RunnerDecision(SandboxFolderMissingMessage.declared().agent_message())
        read_folders = self.project_reads.folders(self.checkouts.checkout(agent_id).project_root) if folder is not None else ()
        writable_folders = self.project_reads.writable_folders() if folder is not None else ()
        run = replace(self.limits.decide(shell, agent_id), read_command=shell.is_readonly, shell_sandbox=sandbox, folder=folder, read_folders=read_folders, writable_folders=writable_folders)
        return RunnerDecision(run=run, shell=shell)
