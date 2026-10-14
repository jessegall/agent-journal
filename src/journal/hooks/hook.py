from dataclasses import dataclass

from journal.hooks.hook_kind import HookKind


@dataclass(frozen=True)
class Hook:
    """What the agent's hook script posts, as the agent sent it."""

    kind: HookKind
    session: str
    environment: str
    tool: str = ""
    input: dict = None

    @classmethod
    def parse(cls, body: dict, environment: str) -> "Hook": ...
