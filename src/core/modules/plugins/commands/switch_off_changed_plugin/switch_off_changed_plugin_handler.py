from dataclasses import replace

from engine.actor.actor import Actor
from core.base.command.bus import Bus
from core.modules.messages.commands.send_message.send_message import SendMessage
from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.plugins.commands.switch_off_changed_plugin.switch_off_changed_plugin import SwitchOffChangedPlugin
from core.modules.plugins.models.plugin import Plugin
from core.modules.skills.support.plugin_skill_removal import PluginSkillRemoval


class SwitchOffChangedPluginHandler(Handler[SwitchOffChangedPlugin, Plugin]):
    """Saves the plugin switched off, its digest kept, so it stays off until the person switches it on, and says
    so in the chat."""

    command = SwitchOffChangedPlugin
    runs_once = True

    def __init__(self, queries: Queries, skill_removal: PluginSkillRemoval, repository: Repository, bus: Bus) -> None:
        self.queries, self.skill_removal, self.repository, self.bus = queries, skill_removal, repository, bus

    def handle(self, command: SwitchOffChangedPlugin, context: Context) -> Plugin:
        plugin = self.queries.query(Plugin).find(command.plugin_id)
        self.skill_removal.remove(plugin.name)
        saved = self.repository.save(plugin.changed(enabled=False), context)
        self.bus.dispatch(SendMessage(f"The plugin {plugin.name} is switched off: its files changed since it was installed. Switch it on once you have read the change."),
                          replace(context, actor=Actor.core()))
        return saved
