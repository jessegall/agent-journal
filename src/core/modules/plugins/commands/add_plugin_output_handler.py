from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.plugins.commands.add_plugin_output import AddPluginOutput
from core.modules.plugins.models.plugin_output import PluginOutput


class AddPluginOutputHandler(Handler[AddPluginOutput, PluginOutput]):
    """Saves the answer, which its listener applies once the hook has committed."""

    command = AddPluginOutput

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: AddPluginOutput, context: Context) -> PluginOutput:
        return self.repository.save(PluginOutput(plugin_id=command.plugin_id, environment_id=command.environment_id, agent_id=command.agent_id,
                                                 creator_id=context.actor.id,
                                                 output=command.output), context)
