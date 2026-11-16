from dataclasses import dataclass
from engine.driver.agent_message import AgentMessage
from engine.driver.shell_line import ShellLine
from core.modules.processes.support.foreground_run import ForegroundRun


@dataclass(frozen=True)
class RunnerDecision:
    """How the runner takes a shell line: refused, with the sandbox line that says why; run as written, because the
    runner is not installed; or run through the runner, with the run it is given."""

    refusal: AgentMessage | None = None
    runner_missing: bool = False
    run: ForegroundRun | None = None
    shell: ShellLine | None = None
