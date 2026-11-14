from typing import NotRequired, TypedDict

from core.modules.codex.providers.support.codex_command_identity import CodexCommandIdentity


class CodexHookIdentity(TypedDict):
    event_name: str
    hooks: list[CodexCommandIdentity]
    matcher: NotRequired[str]
