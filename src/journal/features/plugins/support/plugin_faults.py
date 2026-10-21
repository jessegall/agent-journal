from datetime import datetime, timezone

from journal.support.cards import Cards
from journal.support.actor import Actor
from journal.models.entry import Entry
from journal.models.plugin import Plugin
from journal.repositories.entries import Entries
from journal.repositories.plugins import Plugins
from journal.support.card_kind import CardKind

FAULT = "plugin_fault"
FAILURE_LIMIT = 5


class PluginFaults:
    """A plugin's fault lets the event through and is recorded: an entry naming the plugin, the event and the words, the row's last fault, and a card at the fifth in a row; a card again once it answers."""

    def __init__(self, plugins: Plugins, entries: Entries, cards: Cards) -> None:
        self.plugins, self.entries, self.cards = plugins, entries, cards

    def failed(self, plugin: Plugin, environment_id: int, event: str, text: str) -> None:
        self.entries.save(Entry(environment_id=environment_id, kind=FAULT, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "event": event, "fault": text}), Actor.system())
        row = self.plugins.lookup(plugin.name)
        failing = row.faults_in_a_row + 1 >= FAILURE_LIMIT and row.failing_since is None
        self.plugins.save(row.with_(last_fault=text, faults_in_a_row=row.faults_in_a_row + 1, failing_since=datetime.now(timezone.utc) if failing else row.failing_since), Actor.system())
        if failing:
            self.cards.show(environment_id, "", f"Plugin {plugin.name} is failing: it faulted {FAILURE_LIMIT} times in a row, and events go through without it", "bolt", tone="bad", detail=text, shows=CardKind.PLUGINS)

    def answered(self, plugin: Plugin, environment_id: int) -> None:
        row = self.plugins.lookup(plugin.name)
        if not row.faults_in_a_row:
            return
        self.plugins.save(row.with_(faults_in_a_row=0, failing_since=None), Actor.system())
        if row.failing_since is not None:
            self.cards.show(environment_id, "", f"Plugin {plugin.name} answers again", "check", tone="good", shows=CardKind.PLUGINS)
