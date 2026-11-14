from dataclasses import dataclass

from engine.enums.starter_type import StarterType


@dataclass(frozen=True)
class ExecutionStarter:
    """Who started an execution, as the server resolved it from the session; a helper carries its agent id and the
    role its suite gives it, a plugin its name."""

    starter_type: StarterType
    agent_id: int | None = None
    agent_role: str | None = None
    plugin_name: str | None = None

    @property
    def label(self) -> str:
        if self.starter_type is StarterType.PLUGIN:
            return f"plugin {self.plugin_name}"
        if self.starter_type is StarterType.HELPER:
            return f"{self.agent_role} {self.agent_id}"
        return str(self.starter_type)
