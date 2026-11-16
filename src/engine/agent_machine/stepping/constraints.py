from engine.enums.grant_type import GrantType
from engine.enums.hook_event_name import HookEventName
from engine.driver.refusal_skip_hint import RefusalSkipHint
from dataclasses import replace
from collections.abc import Sequence

from engine.driver.tool import Tool
from engine.agent_stack.reason import Reason
from engine.agent_stack.stack import Stack
from engine.agent_stack.states.compacting import Compacting
from engine.agent_stack.states.paused import Paused
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.stepping.grant import NEXT_ACTION, Grant
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
        self.last_judged: tuple[Question, AgentView, list[tuple[Policy, Sequence[Reason], Grant | None]]] | None = None

    def reasons(self, question: Question, view: AgentView, stack: Stack) -> list[Reason]:
        if question.is_stop():
            stopping = [] if stack.has(Paused) or stack.has(Compacting) else self.stop_policy_reasons(question, view)
            return [*stopping, *self.stop_reasons(view, stack)]
        if question.is_tool_call():
            return [*self.pause_reasons(question, stack), *self.policy_reasons(question, view), *self.block_reasons(question, view, stack)]
        return self.policy_reasons(question, view) if question.is_action() else []

    @staticmethod
    def pause_reasons(question: Question, stack: Stack) -> list[Reason]:
        tool = question.tool()
        paused = next((stacked_state.state for stacked_state in stack.stacked_states if isinstance(stacked_state.state, Paused)), None)
        if paused is None or tool is None or not Constraints.pause_refuses(tool):
            return []
        return [Reason(PAUSE_KEY, DecisionClass.REFUSE, PAUSE_RANK, paused.refusal_text)]

    # Paused lets through reads, searches and a line made only of journal message, a journal command nested in a read
    # counting as the command it runs (doc 1310 section 4.2, point 1)
    @staticmethod
    def pause_refuses(tool: Tool) -> bool:
        message_arguments = tuple(MESSAGE_COMMAND.split()[1:])
        journal_lines = tool.shell.journal_argument_lines() if tool.shell is not None else ()
        if any(line[:len(message_arguments)] != message_arguments for line in journal_lines):
            return True
        if tool.is_readonly:
            return False
        return tool.shell is None or not tool.shell.has_all_parts(lambda part: BlockExemptions.names(part, MESSAGE_COMMAND))

    def stop_policy_reasons(self, question: Question, view: AgentView) -> list[Reason]:
        return [reason for policy in self.policies if policy.judges_stops for reason in policy.refusals(question, view)]

    def policy_reasons(self, question: Question, view: AgentView) -> list[Reason]:
        return [Constraints.skip_hinted(reason, policy, question, view) for policy, refusals, grant in self.judged_policies(question, view) if grant is None for reason in refusals]

    # the grants that pass a refusing policy of the action, which an admitted step spends
    def spent_grants(self, question: Question, view: AgentView) -> list[Grant]:
        if not view.grants:
            return []
        return [grant for _, _, grant in self.judged_policies(question, view) if grant is not None]

    # the policies of one question are judged once a step: its refusals and the grants it spends read the same judgement
    def judged_policies(self, question: Question, view: AgentView) -> list[tuple[Policy, Sequence[Reason], Grant | None]]:
        if self.last_judged is not None and self.last_judged[0] is question and self.last_judged[1] is view:
            return self.last_judged[2]
        judged = self.judged(question, view)
        self.last_judged = (question, view, judged)
        return judged

    def judged(self, question: Question, view: AgentView) -> list[tuple[Policy, Sequence[Reason], Grant | None]]:
        fingerprint = question.fingerprint()
        judged = []
        for policy in self.policies:
            refusals = [replace(reason, is_safety=True) if policy.is_safety else reason for reason in policy.refusals(question, view)]
            if refusals:
                judged.append((policy, refusals, self.passing_grant(policy, view, fingerprint)))
        return judged

    # a policy that refused the agent's last refused hook too names the command that skips it once, at a tool use
    @staticmethod
    def skip_hinted(refusal: Reason, policy: Policy, question: Question, view: AgentView) -> Reason:
        if policy.is_safety or GrantType.REFUSAL_SKIP not in policy.grant_types or question.event is None or question.event.event != HookEventName.PRE_TOOL_USE or policy.key not in view.last_refused_rules:
            return refusal
        return replace(refusal, text=RefusalSkipHint.text(refusal.text, policy.key))

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
        return [*refusals, *(reason for reason, grant in Constraints.state_stop_refusals(view, stack) if grant is None)]

    # the work level's stop refusals, each with the confirmed refusal skip that passes it once; an escalation that
    # defers the work level's state leaves it none
    @staticmethod
    def state_stop_refusals(view: AgentView, stack: Stack) -> list[tuple[Reason, Grant | None]]:
        top = stack.work_level_top()
        if view.escalation is not None and view.escalation.defers_work(top.state_key):
            return []
        return [(reason, None if reason.is_safety else next((grant for grant in view.grants if grant.grant_type is GrantType.REFUSAL_SKIP and grant.passes(reason.key, NEXT_ACTION)), None))
                for reason in top.state.stop_answer(view.work_stop).refusal_reasons()]

    # the grants an admitted stop spends: a skip of a stop refusal of the work level
    @staticmethod
    def spent_stop_grants(view: AgentView, stack: Stack) -> list[Grant]:
        if stack.has(Paused) or stack.has(Compacting):
            return []
        return [grant for _, grant in Constraints.state_stop_refusals(view, stack) if grant is not None]
