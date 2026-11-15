from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.driver.part import Part
from engine.driver.shell_line import JOURNAL_PROGRAM
from suites.coding.modules.workers.agent_messages.worker_judge_scope_message import WorkerJudgeScopeMessage
from suites.coding.modules.workers.types.worker import Worker

JOURNAL_JUDGE = "sins"
SCOPING_FLAGS = ("--changes", "--branch")


class WorkerJudgeScopePolicy(EventPolicy):
    """A worker judges only its own changes or its branch: judging a folder or the whole tree takes minutes and
    shares the machine with the other runs. The main agent keeps the full judge."""

    key = "workers.worker-judge-scope"
    rank = "workers.policies"
    agent_types = [Worker.key]

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        shell = event.tool.shell if event.tool is not None else None
        if shell is not None and any(self.is_unscoped_judge(part) for part in shell.parts):
            return WorkerJudgeScopeMessage.declared().agent_message()
        return None

    @staticmethod
    def is_unscoped_judge(part: Part) -> bool:
        first_argument = part.arguments[0] if part.arguments else ""
        return part.program == JOURNAL_PROGRAM and first_argument == JOURNAL_JUDGE and not any(argument.startswith(SCOPING_FLAGS) for argument in part.arguments)
