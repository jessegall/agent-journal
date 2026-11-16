from dataclasses import dataclass, field
from engine.command.command import Command
from engine.driver.agent_message import AgentMessage


@dataclass(frozen=True)
class ProjectHooksAnswer:
    """What the project's own hooks answered one hook: the refusal they gave, the lines new since each last
    spoke, the notices that record them, the input one replaced and the hook that replaced it, the lines a
    hook that takes none dropped, and their terminal text."""

    refusal: AgentMessage | None
    agent_messages: tuple[AgentMessage, ...]
    commands: tuple[Command[object], ...]
    updated_input: dict[str, object] = field(default_factory=dict[str, object])
    source_name: str = ""
    dropped_lines: int = 0
    terminal: str = ""
