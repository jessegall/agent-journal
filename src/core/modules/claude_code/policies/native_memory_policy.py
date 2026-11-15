from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
import re

from engine.enums.command_effect import CommandEffect
from core.modules.claude_code.nudges.native_memory_ban_nudge import NativeMemoryBanNudge

NATIVE_MEMORY_PATH = re.compile(r"\.claude/projects/[^/\s]+/memory(/|\b)")


class NativeMemoryPolicy(EventPolicy):
    """A write into Claude Code's own memory folder is refused for every agent: the journal keeps the
    memories."""

    key = "claude_code.native-memory"
    rank = "safety.all"
    is_safety = True
    grant_types = []

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        tool = event.tool
        if tool is None or not tool.is_writing_files():
            return None
        writing_texts = (*(part.text for part in tool.shell.parts if CommandEffect.WRITES_FILES in part.classification.effects), *tool.shell.redirects) if tool.shell is not None else ()
        if any(NATIVE_MEMORY_PATH.search(text) for text in (*tool.files, *writing_texts)):
            return NativeMemoryBanNudge.declared().nudge()
        return None

