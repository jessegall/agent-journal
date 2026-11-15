from collections.abc import Sequence

from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.record.question import Question
from engine.agent_machine.stepping.block_exemptions import BlockExemptions
from engine.agent_stack.reason import Reason
from engine.enums.agent_role import AgentRole
from engine.enums.decision_class import DecisionClass
from core.modules.processes.support.output_watch_call import OutputWatchCall
from suites.coding.modules.workers.agent_messages.context_hard_stop_message import ContextHardStopMessage
from suites.coding.modules.workers.types.worker import Worker
from suites.coding.support.context_limit_check import ContextLimitCheck

HARD_LIMIT_KEY = "workers.context-limit-hard-stop"

# the journal commands an agent past its hard context limit may still run, so it can meet what its stop asks
STOP_REQUIREMENT_COMMANDS = ("memory", "message", "wait", "refusal", "agent-block", "overview", "question", "sequence", "skill required",
                             "doc close", "report close", "task log", "task test", "task close", "task block", "task start", "task overview")


class ContextHardLimitPolicy(Policy):
    """Past the second context limit, refuses every tool but what lets the agent stop (doc 1310 section 4.10):
    reads and searches, an output watch, the journal commands a stop can be refused for, and the lifting
    lines of every block open on it, read at each step, so a new block's way out is never locked."""

    key = HARD_LIMIT_KEY
    # sync takes a safety policy from core modules alone, so this one is the admission slice's, ranked with access
    rank = "access.all"
    grant_types = []
    agent_types = [AgentRole.MAIN, Worker.key]

    def __init__(self, limits: ContextLimitCheck, watch_call: OutputWatchCall) -> None:
        self.limits, self.watch_call = limits, watch_call

    def refusals(self, question: Question, view: AgentView) -> Sequence[Reason]:
        tool, event = question.tool(), question.event
        if tool is None or event is None or tool.is_readonly or tool.is_search or self.watch_call.is_watch_event(event):
            return []
        lifting_lines = [line for block in view.blocks for line in block.reason.lifting_lines]
        if tool.shell is not None and (tool.shell.is_journal_command_line(*STOP_REQUIREMENT_COMMANDS)
                                       or tool.shell.has_only_parts(lambda part: any(BlockExemptions.names(part, line) for line in lifting_lines))):
            return []
        if not self.limits.exceeds_hard_limit(view.agent.agent_id):
            return []
        return [Reason(self.key, DecisionClass.REFUSE, self.rank, ContextHardStopMessage.declared().agent_message().text)]
