from dataclasses import replace

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.block_until import BlockUntil
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.span_queries import SpanQueries
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task_block_review import TaskBlockReview
from core.modules.tasks.support.block_conditions.task_blocks_reviewed import TaskBlocksReviewed
from core.modules.tasks.support.task_nudges import BLOCK_REVIEW, BLOCK_REVIEW_REQUIRED, BLOCK_REVIEW_INTERVAL, USER_BLOCK_REVIEW

class UnopenableBlockRule(DriverRule):
    """Periodically holds the main agent until it reviews tasks that need manual release."""

    name = "tasks.unopenable-blocks"
    hook = HookEventName.POST_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, queries: Queries, spans: SpanQueries) -> None:
        self.queries, self.spans = queries, spans

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tasks = tuple(self.queries.query(TaskBlockReview).filter(session_agent_id=hook.agent_id, state=TaskState.BLOCKED, automatic=False).all_rows())
        if not tasks:
            return RuleAnswer.allowed()
        block = self.queries.query(AgentBlock).filter(session_agent_id=hook.agent_id, nudge_key=BLOCK_REVIEW_REQUIRED.key).matching(IsNull("closed_at")).first()
        if block is not None and TaskBlocksReviewed.stored(block.condition_text).pending(tasks):
            return RuleAnswer.allowed()
        passed = BLOCK_REVIEW_INTERVAL.has_passed_many(self.spans, hook.agent_id, [task.reviewed_at for task in tasks], hook.timestamp)
        due = [task for task, passed_span in zip(tasks, passed) if passed_span]
        notices = [replace((USER_BLOCK_REVIEW if task.user_wait else BLOCK_REVIEW).nudge(task=task.task_id),
                           interval=None, record_keys=tuple([f"{BLOCK_REVIEW.key}.{task.task_id}"])) for task in due]
        manual = [task for task in due if not task.user_wait]
        answer = RuleAnswer.with_nudges(*notices)
        if not manual:
            return answer
        condition = TaskBlocksReviewed.build(manual)
        refusal = BLOCK_REVIEW_REQUIRED.nudge(tasks=", ".join(str(task.task_id) for task in manual))
        return answer.running(BlockUntil(hook.agent_id, refusal, condition),
                              BlockUntil(hook.agent_id, replace(refusal, key=refusal.key + ".stop"), condition, blocks_stop=True))
