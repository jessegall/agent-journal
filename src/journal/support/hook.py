from dataclasses import dataclass, field, replace

from journal.support.hook_kind import HookKind


@dataclass(frozen=True)
class Hook:
    """What the agent's hook script posts, as the agent sent it, with the id of the launch it came from and the millisecond the script started at when it stamped its request; stored, a tool's response is cut to KEPT characters a text, so a long read or a command's whole output is not kept once more for every call."""

    RESPONSE_CHARACTERS = 4000

    kind: HookKind
    session: str
    environment: str
    provider: str = "claude"
    body: dict = field(default_factory=dict)
    started_ms: int = 0
    launch: str = ""

    @classmethod
    def parse(cls, body: dict, environment: str, provider: str, launch: str) -> "Hook":
        return cls(HookKind(body["hook_event_name"]), body["session_id"], environment, provider, body, launch=launch)

    def stamped(self, started_ms: int) -> "Hook":
        return replace(self, started_ms=started_ms)

    def stored(self) -> dict:
        if "tool_response" not in self.body:
            return self.body
        return {**self.body, "tool_response": self.cut(self.body["tool_response"])}

    @classmethod
    def cut(cls, value):
        if isinstance(value, str):
            return value[: cls.RESPONSE_CHARACTERS]
        if isinstance(value, dict):
            return {key: cls.cut(inner) for key, inner in value.items()}
        if isinstance(value, list):
            return [cls.cut(inner) for inner in value]
        return value

    @property
    def tool(self) -> str:
        return self.body.get("tool_name", "")

    @property
    def input(self) -> dict:
        return self.body.get("tool_input", {})

    @property
    def output(self) -> str:
        return self.output_text(self.body.get("tool_response", ""))

    @property
    def error(self) -> str:
        return str(self.body.get("error", ""))

    @property
    def response(self) -> dict:
        response = self.body.get("tool_response", "")
        return response if isinstance(response, dict) else {}

    @staticmethod
    def output_text(response) -> str:
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
    def stop_refused_earlier(self) -> bool:
        return bool(self.body.get("stop_hook_active"))

    @property
    def subagent(self) -> str:
        return self.body.get("agent_id", "") or self.body.get("subagent_id", "")

    @property
    def subagent_report(self) -> str:
        return self.body.get("last_assistant_message", "")
