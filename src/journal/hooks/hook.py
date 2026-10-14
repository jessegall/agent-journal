from dataclasses import dataclass, field

from journal.hooks.hook_kind import HookKind


@dataclass(frozen=True)
class Hook:
    """What the agent's hook script posts, as the agent sent it."""

    kind: HookKind
    session: str
    environment: str
    body: dict = field(default_factory=dict)

    @classmethod
    def parse(cls, body: dict, environment: str) -> "Hook":
        return cls(HookKind(body["hook_event_name"]), body["session_id"], environment, body)

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
        return self.body.get("prompt", "") or self.body.get("message", "")

    @property
    def subagent(self) -> str:
        return self.body.get("agent_id", "") or self.body.get("subagent_id", "")
