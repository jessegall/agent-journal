from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.agent_message import AgentMessage


@dataclass(frozen=True)
class PluginHookAnswer:
    """What the enabled plugins answered one hook: the line of a plugin that refused it, if one did, and the
    commands that deliver the hook, record the plugins' lines and drain their queues."""

    refusal: AgentMessage | None
    commands: tuple[Command[object], ...]
