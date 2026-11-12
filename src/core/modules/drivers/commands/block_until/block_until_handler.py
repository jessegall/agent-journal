from engine.command.context import Context
from engine.command.handler import Handler
from engine.database.kept_rows import KeptRows
from engine.driver.block_until import BlockUntil
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan


class BlockUntilHandler(Handler[BlockUntil, AgentBlock]):
    """Opens a block, or brings the open one with the same line up to date with its words."""

    command = BlockUntil

    def __init__(self, queries: Queries, repository: Repository, kept: KeptRows) -> None:
        self.queries, self.repository = queries, repository
        self.kept = kept

    def handle(self, command: BlockUntil, context: Context) -> AgentBlock:
        line_blocks = self.queries.query(AgentBlock).filter(session_agent_id=command.agent_id, nudge_key=command.nudge.key).matching(IsNull("closed_at"))
        query = line_blocks.filter(condition_text=command.condition.text) if command.condition.subject_scoped else line_blocks
        existing = self.kept.read(query, query.first, name="drivers.open_block")
        saved = self.save_block(command, context, existing)
        self.kept.update(query, lambda previous: saved, name="drivers.open_block")
        return saved

    def save_block(self, command: BlockUntil, context: Context, existing: AgentBlock | None) -> AgentBlock:
        if existing is not None:
            return self.repository.update(existing, context, nudge_text=command.nudge.text, condition_name=command.condition.name, condition_text=command.condition.text,
                                      countdown_text=command.countdown.text if command.countdown else existing.countdown_text)
        return self.repository.save(AgentBlock(session_agent_id=command.agent_id, creator_id=context.actor.id, nudge_key=command.nudge.key, nudge_text=command.nudge.text,
                                               condition_name=command.condition.name, condition_text=command.condition.text, grace_tool_uses=self.tool_uses(command.after),
                                               grace_seconds=command.after.seconds if command.after is not None else 0, countdown_key=command.countdown.key if command.countdown else "",
                                               countdown_text=command.countdown.text if command.countdown else "", blocks_stop=command.blocks_stop, strict=command.strict, is_skippable=command.is_skippable, countdown_limit=command.countdown_limit), context)

    @staticmethod
    def tool_uses(after: Interval | None) -> int:
        spans = after.spans if after is not None else ()
        if any(not isinstance(span, (ToolUseSpan, Seconds)) for span in spans):
            raise ValueError("a block's grace holds tool uses and seconds only")
        return next((span.count for span in spans if isinstance(span, ToolUseSpan)), 0)
