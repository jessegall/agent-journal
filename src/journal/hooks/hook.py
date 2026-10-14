from dataclasses import dataclass, field

from journal.hooks.hook_kind import HookKind


@dataclass(frozen=True)
class Hook:
    """What the agent's hook script posts, as the agent sent it."""

    kind: HookKind
    session: str
    environment: str
    provider: str = "claude"
    body: dict = field(default_factory=dict)

    @classmethod
    def parse(cls, body: dict, environment: str, provider: str) -> "Hook":
        return cls(HookKind(body["hook_event_name"]), body["session_id"], environment, provider, body)

    @property
    def tool(self) -> str:
        return self.body.get("tool_name", "")

    @property
    def input(self) -> dict:
        return self.body.get("tool_input", {})

    @property
    def output(self) -> str:
        response = self.body.get("tool_response", "")
        return response if isinstance(response, str) else str(response)

    @property
    def text(self) -> str:
        return self.body.get("prompt", "") or self.body.get("delta", "") or self.body.get("message", "")

    @property
    def turn_id(self) -> str:
        return self.body.get("message_id", "") or self.body.get("turn_id", "")

    @property
    def final(self) -> bool:
        return bool(self.body.get("final", True))

    @property
    def stop_again(self) -> bool:
        """Claude's Stop hook says when it already refused this stop once; a second refusal would loop."""
        return bool(self.body.get("stop_hook_active", False))

    @property
    def source(self) -> str:
        return self.body.get("source", "")

    @property
    def subagent(self) -> str:
        return self.body.get("agent_id", "") or self.body.get("subagent_id", "")
