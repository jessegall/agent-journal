import re
from enum import StrEnum

from engine.driver.hook_event_name import HookEventName

CAPITAL = re.compile(r"(?<!^)(?=[A-Z])")


class CodexHookEvent(StrEnum):
    SESSION_START = "SessionStart"
    PROMPT = "UserPromptSubmit"
    PRE_TOOL_USE = "PreToolUse"
    POST_TOOL_USE = "PostToolUse"
    COMPACT = "PreCompact"
    STOP = "Stop"
    SESSION_END = "SessionEnd"

    @property
    def key(self) -> str:
        return CAPITAL.sub("_", self.value).lower()

    @property
    def event(self) -> HookEventName:
        return {self.SESSION_START: HookEventName.SESSION_START, self.PROMPT: HookEventName.PROMPT,
                self.PRE_TOOL_USE: HookEventName.PRE_TOOL_USE, self.POST_TOOL_USE: HookEventName.POST_TOOL_USE,
                self.COMPACT: HookEventName.COMPACT, self.STOP: HookEventName.STOP,
                self.SESSION_END: HookEventName.SESSION_END}[self]

    @property
    def has_matcher(self) -> bool:
        return self not in (self.PROMPT, self.STOP)

    @property
    def has_context(self) -> bool:
        return self in (self.SESSION_START, self.PROMPT, self.PRE_TOOL_USE, self.POST_TOOL_USE)

    def timeout(self, seconds: int) -> int:
        return min(3, max(1, seconds)) if self is self.SESSION_END else max(1, seconds)

    @property
    def default_timeout(self) -> int:
        return 1 if self is self.SESSION_END else 600
