from dataclasses import dataclass

from journal.providers.support.claude_block import ClaudeBlock


@dataclass(frozen=True)
class ClaudeRow:
    """One line of a Claude transcript: who wrote it, its blocks, whether it is a compaction's summary or an injected line, and when; for a line of Claude Code's queue, what it did and what it queued."""

    type: str
    blocks: tuple[ClaudeBlock, ...] = ()
    summary: bool = False
    meta: bool = False
    timestamp: str = ""
    operation: str = ""
    queued: str = ""

    @classmethod
    def from_json(cls, data: dict) -> "ClaudeRow":
        content = data.get("message", {}).get("content", [])
        blocks = (ClaudeBlock("text", content),) if isinstance(content, str) else tuple(ClaudeBlock.from_json(b) for b in content if isinstance(b, dict))
        return cls(str(data.get("type", "")), blocks, bool(data.get("isCompactSummary")), bool(data.get("isMeta")), str(data.get("timestamp", "")),
                   str(data.get("operation", "")), str(data.get("content", "")) if data.get("type") == "queue-operation" else "")

    @property
    def is_enqueued(self) -> bool:
        """A line of Claude Code's queue that put something in it, once for each thing queued."""
        return self.type == "queue-operation" and self.operation == "enqueue"

    def of_type(self, kind: str) -> list[ClaudeBlock]:
        return [b for b in self.blocks if b.type == kind]

    @property
    def is_prompt(self) -> bool:
        """A row of the user's that is no tool's result: a new turn starts here."""
        return self.type == "user" and not self.of_type("tool_result")

    @property
    def kind(self) -> str:
        """What the row is in the chat: a compaction's summary, the agent's, a tool's result, an injected line or the human's."""
        if self.summary:
            return "summary"
        if self.type == "assistant":
            return "agent"
        if self.of_type("tool_result"):
            return "tool"
        return "injected" if self.meta else "human"
