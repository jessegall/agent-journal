from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from suites.coding.modules.workers.types.worker import Worker
from suites.coding.nudges.worker_git_ban_message import WorkerGitBanMessage

GIT_PROGRAMS = ("git",)


class WorkerGitPolicy(EventPolicy):
    """A worker runs no git anywhere in a shell line: the journal commits, rebases and merges its worktree."""

    key = "workers.no-git"
    rank = "shell.all"
    agent_types = [Worker.key]

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        refused = shell.denied_program_part(GIT_PROGRAMS) if shell is not None else None
        return WorkerGitBanMessage.declared().nudge(program=refused.program) if refused is not None else None
