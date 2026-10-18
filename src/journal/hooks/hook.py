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
        return self.printed(self.body.get("tool_response", ""))

    @property
    def response(self) -> dict:
        got = self.body.get("tool_response", "")
        return got if isinstance(got, dict) else {}

    @staticmethod
    def printed(response) -> str:
        """What a tool call printed: Claude hands a shell's output as a dict of stdout and stderr, other tools as text."""
        if isinstance(response, dict):
            return "\n".join(part for part in (response.get("stdout", ""), response.get("stderr", "")) if part) or str({k: v for k, v in response.items() if k not in ("stdout", "stderr")})
        return response if isinstance(response, str) else str(response)

    @property
    def text(self) -> str:
        return self.body.get("prompt", "") or self.body.get("delta", "") or self.body.get("message", "")

    @property
    def turn_id(self) -> str:
        return self.body.get("message_id", "") or self.body.get("turn_id", "")

    @property
    def index(self) -> int:
        return int(self.body.get("index", 0))

    @property
    def final(self) -> bool:
        return bool(self.body.get("final", True))

    @property
    def source(self) -> str:
        return self.body.get("source", "")

    @property
    def stop_held_before(self) -> bool:
        return bool(self.body.get("stop_hook_active"))

    @property
    def subagent(self) -> str:
        return self.body.get("agent_id", "") or self.body.get("subagent_id", "")
