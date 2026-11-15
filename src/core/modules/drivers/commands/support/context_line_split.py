from collections.abc import Sequence
from dataclasses import dataclass, replace

from engine.driver.agent_message import AgentMessage

LINE_BREAK = 1


@dataclass(frozen=True)
class ContextLineSplit:
    """The lines of one reply cut for a program that swaps a longer text for a file: the whole lines that fit within the
    limit, counted with the line breaks that join them, go in this reply, and the rest wait for the agent's next hook.
    A first line longer than the limit on its own is cut at the limit."""

    kept: tuple[AgentMessage, ...]
    rest: tuple[AgentMessage, ...]

    @classmethod
    def split(cls, lines: Sequence[AgentMessage], limit: int) -> "ContextLineSplit":
        if limit <= 0:
            return cls(tuple(lines), ())
        kept: list[AgentMessage] = []
        used = 0
        for index, agent_message in enumerate(lines):
            size = len(agent_message.text) + (LINE_BREAK if kept else 0)
            if used + size > limit:
                if not kept:
                    return cls((replace(agent_message, text=agent_message.text[:limit]),), tuple(lines[index + 1:]))
                return cls(tuple(kept), tuple(lines[index:]))
            kept.append(agent_message)
            used += size
        return cls(tuple(kept), ())
