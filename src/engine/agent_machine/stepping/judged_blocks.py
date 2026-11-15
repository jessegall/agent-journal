from engine.agent_stack.open_block import OpenBlock
from engine.agent_stack.reason import Reason
from engine.agent_machine.agent_view import AgentView
from engine.agent_machine.needs.block_plan import BlockPlan
from engine.enums.condition_outcome import ConditionOutcome
from engine.enums.decision_class import DecisionClass

CLOSING_OUTCOMES = (ConditionOutcome.SATISFIED, ConditionOutcome.CANCELLED, ConditionOutcome.TARGET_MISSING)


class JudgedBlocks:
    """The blocks a step judges: every open row whose condition was not judged closed, and every plan of the
    step whose row is not open yet, judged as if it were; a plan with a grace lets the action that found it
    through."""

    @staticmethod
    def constraining(view: AgentView) -> list[OpenBlock]:
        rows = [block for block in view.blocks if block.block_id is None or view.block_outcomes.get(block.block_id, ConditionOutcome.PENDING) not in CLOSING_OUTCOMES]
        return [*rows, *(JudgedBlocks.planned(plan) for plan in JudgedBlocks.new_plans(view))]

    @staticmethod
    def new_plans(view: AgentView) -> list[BlockPlan]:
        open_keys = {block.nudge_key for block in view.blocks}
        return [plan for plan in view.plans if plan.nudge.key not in open_keys]

    @staticmethod
    def planned(plan: BlockPlan) -> OpenBlock:
        reason = Reason(plan.tool_check_key, DecisionClass.HOLD, plan.rank, plan.nudge.text, plan.lifting_lines, plan.subject)
        return OpenBlock(plan.nudge.key, None, reason, plan.scope_tools, plan.scope_stop, plan.tool_grace_uses == 0, plan.stop_grace_seconds == 0,
                        plan.is_strict, plan.subject)
