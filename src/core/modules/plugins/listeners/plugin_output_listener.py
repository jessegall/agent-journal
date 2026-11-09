import io
import shlex

from core.base.agent_role import AgentRole
from core.base.caller.caller import Caller
from core.base.change.logged_event import LoggedEvent
from core.base.cli.console import Console
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.modules.plugins.commands.record_plugin_fault.record_plugin_fault import RecordPluginFault
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.chat.commands.show_mark.show_mark import ShowMark
from core.modules.plugins.models.enums.plugin_card_tone import PluginCardTone
from core.modules.plugins.models.enums.plugin_mark_type import PluginMarkType
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_output import PluginOutput
from core.modules.plugins.support.plugin_answer import MOST_COMMAND_LINES, PluginAnswer
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest
from core.modules.plugins.support.plugin_skill_files import PluginSkillFiles
from core.modules.skills.commands.request_skill.request_skill import RequestSkill
from core.modules.plugins.support.plugins_module_name import MODULE_NAME
from core.base.change.created import Created

TONES = {tone.value: tone for tone in PluginCardTone}


class PluginOutputListener(CommitListener[Created[PluginOutput]]):
    """Applies plugin cards, commands and required skills after the reply."""

    name = "plugins.output"

    def __init__(self, queries: Queries, folders: PluginFolders, bus: Bus, console: Console, actors: ModuleActors, skill_files: PluginSkillFiles) -> None:
        self.queries, self.folders, self.bus, self.console, self.actors, self.skill_files = queries, folders, bus, console, actors, skill_files

    def handle(self, event: Created[PluginOutput], logged: LoggedEvent) -> None:
        row = event.row
        plugin = self.queries.query(Plugin).find(row.plugin_id)
        answer, actor = PluginAnswer.parsed(row.output), self.actors.actor(MODULE_NAME)
        try:
            manifest = PluginManifest.read(self.folders.code(plugin.name))
        except Refusal as refusal:
            self.bus.run(RecordPluginFault(plugin.id, refusal.reason), actor, cause_id=logged.id)
            return
        is_main = row.session_agent_id is not None and self.queries.query(Agent).find(row.session_agent_id).role == AgentRole.MAIN
        environment_visible = row.is_environment_visible and row.environment_id is not None
        for card in answer.cards if is_main or environment_visible else ():
            tone = card.tone or (manifest.card_tones[card.card_type] if card.card_type in manifest.card_tones else "")
            if tone in TONES:
                key = f"plugin:{plugin.name}:{row.session_agent_id}:{card.key}" if is_main else f"plugin:{plugin.name}:{card.key}"
                self.bus.run(ShowMark(PluginMarkType.CARD, TONES[tone], key, f"{plugin.name}: {card.label}",
                                      detail=card.detail, figure="" if tone == PluginCardTone.GOOD else answer.duration_text()), actor, cause_id=logged.id, environment_id=row.environment_id)
        for line in answer.commands[:MOST_COMMAND_LINES]:
            self.console.run(shlex.split(line), Caller(actor, plugin_script=plugin.name), io.StringIO())
        published = self.skill_files.names(self.folders.code(plugin.name), manifest)
        for name in [name for name in answer.required_skills if name in published and row.session_agent_id is not None]:
            self.bus.run(RequestSkill(row.session_agent_id, name), actor, cause_id=logged.id)
