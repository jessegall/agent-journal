from collections.abc import Sequence

from engine.agent_stack.reason import Reason
from engine.agent_stack.stack import Stack
from engine.agent_stack.states.compacting import Compacting
from engine.agent_stack.states.paused import Paused
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.contracts.grant import Grant
from engine.agent_machine.contracts.policy import Policy
from engine.agent_machine.record.question import Question
from engine.agent_machine.stepping.block_exemptions import MESSAGE_COMMAND, BlockExemptions
from engine.agent_machine.stepping.judged_blocks import JudgedBlocks
from engine.enums.decision_class import DecisionClass

PAUSE_KEY = "drivers.paused-agent"
PAUSE_RANK = "safety.paused"


class Constraints:
    """Judges one action against Paused, every safety policy, every policy and every open block, keeping every
    reason (doc 1310 section 4.2): a grant passes only the policy it names and never a safety policy, no
    exemption of a block passes a policy, a prompt is judged by policies alone, and an observation by
    nothing."""

    def __init__(self, policies: Sequence[Policy]) -> None:
        self.policies = policies

    def reasons(self, question: Question, view: AgentView, stack: Stack) -> list[Reason]:
        if question.is_stop():
            return self.stop_reasons(view, stack)
        if question.is_tool_call():
            return [*self.pause_reasons(question, stack), *self.policy_reasons(question, view), *self.block_reasons(question, view, stack)]
        return self.policy_reasons(question, view) if question.is_action() else []

    @staticmethod
    def pause_reasons(question: Question, stack: Stack) -> list[Reason]:
        tool = question.tool()
        paused = next((frame.state for frame in stack.frames if isinstance(frame.state, Paused)), None)
        if paused is None or tool is None or tool.is_readonly or tool.is_search:
            return []
        if tool.shell is not None and tool.shell.has_only_parts(lambda part: BlockExemptions.names(part, MESSAGE_COMMAND)):
            return []
        return [Reason(PAUSE_KEY, DecisionClass.REFUSE, PAUSE_RANK, paused.refusal_text)]

    def policy_reasons(self, question: Question, view: AgentView) -> list[Reason]:
        return [reason for _, refusals, grant in self.judged_policies(question, view) if grant is None for reason in refusals]

    # the grants that pass a refusing policy of the action, which an admitted step spends
    def spent_grants(self, question: Question, view: AgentView) -> list[Grant]:
        if not view.grants:
            return []
        return [grant for _, _, grant in self.judged_policies(question, view) if grant is not None]

    def judged_policies(self, question: Question, view: AgentView) -> list[tuple[Policy, Sequence[Reason], Grant | None]]:
        fingerprint = question.fingerprint()
        judged = []
        for policy in self.policies:
            if policy.agent_types and view.agent.agent_type not in policy.agent_types:
                continue
            refusals = policy.refusals(question, view)
            if refusals:
                judged.append((policy, refusals, self.passing_grant(policy, view, fingerprint)))
        return judged

    @staticmethod
    def passing_grant(policy: Policy, view: AgentView, fingerprint: str) -> Grant | None:
        if policy.is_safety:
            return None
        return next((grant for grant in view.grants if grant.grant_type in policy.grant_types and grant.passes(policy.key, fingerprint)), None)

    @staticmethod
    def block_reasons(question: Question, view: AgentView, stack: Stack) -> list[Reason]:
        tool = question.tool()
        if tool is None:
            return []
        blocks = JudgedBlocks.constraining(view)
        exemptions = BlockExemptions(blocks, stack.has(Paused))
        return [block.reason for block in blocks if block.refuses_tools() and not exemptions.passes(tool, block)]

    @staticmethod
    def stop_reasons(view: AgentView, stack: Stack) -> list[Reason]:
        if stack.has(Paused) or stack.has(Compacting):
            return []
        refusals = [block.stop_refusal() for block in JudgedBlocks.constraining(view) if block.refuses_stop(view.escalation)]
        return [*refusals, *stack.work_lane_top().state.stop_answer(view.work_stop).refusal_reasons()]
