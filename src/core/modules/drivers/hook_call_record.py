from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_reply import HookReply


@dataclass(frozen=True)
class HookCallRecord(Command[HookReply]):
    """Answers one hook of an agent and keeps the answer."""

    event: HookEvent
    agent_id: int
