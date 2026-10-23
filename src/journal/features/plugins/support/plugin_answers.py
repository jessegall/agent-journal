import shlex

from journal.console.console import Console
from journal.support.caller import Caller
from journal.chat.moment_cards import MomentCards
from journal.features.plugins.support.plugin_process_card import PluginProcessCard
from journal.features.plugins.support.plugin_steps import PluginSteps
from journal.features.plugins.support.plugin_text import PluginText
from journal.support.actor import Actor
from journal.models.entry import Entry
from journal.models.plugin import Plugin
from journal.features.plugins.support.plugin_answer import PluginAnswer
from journal.features.plugins.support.plugin_card import PluginCard
from journal.repositories.entries import Entries
from journal.support.card_kind import CardKind

COMMAND = "plugin_command"


class PluginAnswers:
    """What a plugin's answer asks beyond the hook's reply: its cards in the chat, a moment card each, or a process card, PluginProcessCard, for one with a key, replacing the earlier of that key where it stands if the user has not written since, else at the bottom of the chat, and its journal commands run as the plugin, a step deeper."""

    def __init__(self, card: PluginProcessCard, cards: MomentCards, console: Console, entries: Entries, steps: PluginSteps, text: PluginText) -> None:
        self.card, self.cards, self.console, self.entries, self.steps, self.text = card, cards, console, entries, steps, text

    def apply(self, plugin: Plugin, answer: PluginAnswer, environment: str, environment_id: int) -> None:
        for card in answer.cards:
            self.show(plugin, card, environment_id)
        with self.steps.deeper():
            for line in answer.commands:
                self.run(plugin, line, environment, environment_id)

    def show(self, plugin: Plugin, card: PluginCard, environment_id: int) -> None:
        kind = plugin.manifest.card_kind(card.kind)
        label = self.text.plain(card.label or kind.label)
        data = {"kind": "plugin", "plugin": plugin.name, "card": card.kind, "icon": kind.icon, "tone": card.tone or kind.tone, "collapsed": kind.collapsed}
        if card.key:
            self.card.show(plugin, card, environment_id, label, data)
            return
        self.cards.show_fields(environment_id, None, label, data, Actor.plugin(plugin.name), CardKind.PLUGINS, self.text.plain(card.detail))

    def run(self, plugin: Plugin, line: str, environment: str, environment_id: int) -> None:
        argv = shlex.split(line)
        if argv[:1] != ["journal"]:
            self.record(plugin, line, environment_id, 1, "a plugin runs journal commands only")
            return
        outcome = self.console.run(argv[1:], Caller.plugin(environment or "main", plugin.name))
        self.record(plugin, line, environment_id, outcome.code, outcome.error.strip()[-300:])

    def record(self, plugin: Plugin, line: str, environment_id: int, code: int, err: str) -> None:
        self.entries.save(Entry(environment_id=environment_id, kind=COMMAND, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "command": line, "code": code, "err": err}), Actor.plugin(plugin.name))
