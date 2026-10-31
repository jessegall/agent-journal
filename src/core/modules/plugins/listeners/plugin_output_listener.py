import io
import shlex

from core.base.caller.caller import Caller
from core.base.change.logged_event import LoggedEvent
from core.base.cli.console import Console
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.module.module_actors import ModuleActors
from core.base.query.queries import Queries
from core.modules.chat.commands.show_mark import ShowMark
from core.modules.plugins.models.enums.plugin_card_tone import PluginCardTone
from core.modules.plugins.models.enums.plugin_mark_type import PluginMarkType
from core.modules.plugins.models.plugin import Plugin
from core.modules.plugins.models.plugin_output import PluginOutput
from core.modules.plugins.support.plugin_answer import PluginAnswer
from core.modules.plugins.support.plugin_folders import PluginFolders
from core.modules.plugins.support.plugin_manifest import PluginManifest

MODULE_NAME = "journal.core.plugins"
MOST_COMMAND_LINES = 20
TONES = {tone.value: tone for tone in PluginCardTone}


class PluginOutputListener(CommitListener):
    """Applies a plugin's answer after the reply, as the plugins module, which can never act as the person: a
    chat mark for each card of a kind its manifest declares, keyed so a card with the same key is updated in
    place, and its journal command lines, at most twenty."""

    name = "plugins.output"
    event = "plugin_output.create"

    def __init__(self, queries: Queries, folders: PluginFolders, bus: Bus, console: Console, actors: ModuleActors) -> None:
        self.queries, self.folders, self.bus, self.console, self.actors = queries, folders, bus, console, actors

    def handle(self, event: LoggedEvent) -> None:
        row = self.queries.query(PluginOutput).find(event.row_id)
        plugin = self.queries.query(Plugin).find(row.plugin_id)
        manifest, answer, actor = PluginManifest.read(self.folders.code(plugin.name)), PluginAnswer.parsed(row.output), self.actors.actor(MODULE_NAME)
        for card in answer.cards:
            tone = card.tone or (manifest.card_tones[card.card_type] if card.card_type in manifest.card_tones else "")
            if tone in TONES:
                self.bus.run(ShowMark(row.environment_id, PluginMarkType.CARD, TONES[tone], f"plugin:{plugin.name}:{card.key}", f"{plugin.name}: {card.label}",
                                      detail=card.detail), actor, cause_id=event.id, environment_id=row.environment_id)
        for line in answer.commands[:MOST_COMMAND_LINES]:
            self.console.run(shlex.split(line), Caller(actor), io.StringIO())
