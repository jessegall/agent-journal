from dataclasses import replace

from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.reason import Reason
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.states.block_plan import BlockPlan
from engine.enums.condition_outcome import ConditionOutcome
from engine.enums.decision_class import DecisionClass

CLOSING_OUTCOMES = (ConditionOutcome.SATISFIED, ConditionOutcome.CANCELLED, ConditionOutcome.TARGET_MISSING)


BLOCK_FIELD = "{block}"


class JudgedBlocks:
    """The blocks a step judges: every open row whose condition was not judged closed, and every plan of the
    step whose row is not open yet, judged as if it were; a plan with a grace lets the action that found it
    through."""

    @staticmethod
    def constraining(view: AgentView) -> list[OpenBlock]:
        plans = {plan.agent_message.key: plan for plan in view.plans}
        rows = [JudgedBlocks.with_plan(block, plans.get(block.agent_message_key)) for block in view.blocks
                if block.block_id is None or view.block_outcomes.get(block.block_id, ConditionOutcome.PENDING) not in CLOSING_OUTCOMES]
        return [*rows, *(JudgedBlocks.planned(plan) for plan in JudgedBlocks.new_plans(view))]

    # an open row whose need still plans it this step decides under the plan's rank, check keys, stop text and subject,
    # its texts naming the row's number where they name the hold's
    @staticmethod
    def with_plan(block: OpenBlock, plan: BlockPlan | None) -> OpenBlock:
        if plan is None:
            return block
        planned = JudgedBlocks.planned(plan)
        numbered = str(block.block_id)
        reason = replace(planned.reason, text=planned.reason.text.replace(BLOCK_FIELD, numbered))
        stop_reason = replace(planned.stop_reason, text=planned.stop_reason.text.replace(BLOCK_FIELD, numbered)) if planned.stop_reason is not None else None
        return replace(block, reason=reason, stop_reason=stop_reason, subject=planned.subject)

    @staticmethod
    def new_plans(view: AgentView) -> list[BlockPlan]:
        open_keys = {block.agent_message_key for block in view.blocks}
        return [plan for plan in view.plans if plan.agent_message.key not in open_keys]

    @staticmethod
    def planned(plan: BlockPlan) -> OpenBlock:
        reason = Reason(plan.tool_check_key, DecisionClass.BLOCK, plan.rank, plan.agent_message.text, plan.lifting_lines, plan.subject)
        stop_reason = Reason(plan.stop_check_key or plan.tool_check_key, DecisionClass.BLOCK, plan.rank, plan.stop_agent_message.text, plan.lifting_lines, plan.subject) if plan.stop_agent_message is not None else None
        return OpenBlock(plan.agent_message.key, None, reason, plan.scope_tools, plan.scope_stop, plan.tool_grace_uses == 0, plan.stop_grace_seconds == 0,
                        plan.is_strict, plan.subject, stop_reason)
