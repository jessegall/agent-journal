from dataclasses import dataclass

from engine.command.command import Command
from core.modules.plugins.support.plugin_command_run import PluginCommandRun


@dataclass(frozen=True)
class RunPluginCommand(Command[PluginCommandRun]):
    """Runs a shell line at the root of the checkout of an agent, for a plugin or a user; a run of a kind the
    plugin declares is queued as that kind."""

    lock = False

    agent_id: int
    line: str
    is_readonly: bool
    plugin: str
    run_name: str = ""
