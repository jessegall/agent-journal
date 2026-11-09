from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class HookTimeoutNotice(Model):
    """Three hook timeouts of one agent in ten minutes, told to its main agent and shown in the chat."""

    model_name = "hook_timeout_notice"
    cli_name = "hook-timeout-notice"

    session_agent_id: int
    receiver_id: int
    timeout_count: int
    slowest_rule: str

    @property
    def text(self) -> str:
        return f"Agent {self.session_agent_id}: {self.timeout_count} hook timeouts in ten minutes, slowest rule {self.slowest_rule}"
