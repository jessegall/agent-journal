import shlex

from journal.console.console import Console
from journal.support.where import Where
from journal.support.cards import Cards
from journal.features.plugins.plugin_steps import PluginSteps
from journal.features.plugins.plugin_words import PluginWords
from journal.support.actor import Actor
from journal.models.entry import Entry
from journal.models.plugin import Plugin
from journal.models.plugin_answer import PluginAnswer
from journal.models.plugin_card import PluginCard
from journal.repositories.entries import Entries

COMMAND = "plugin_command"
"""The entry each command a plugin ran leaves: the line, its exit code and what it printed on error."""


class PluginAnswers:
    """What a plugin's answer asks beyond the hook's reply: its cards in the chat, one with a key replacing the earlier of that key, and its journal commands run as the plugin, a step deeper."""

    def __init__(self, cards: Cards, console: Console, entries: Entries, steps: PluginSteps, words: PluginWords) -> None:
        self.cards, self.console, self.entries, self.steps, self.words = cards, console, entries, steps, words

    def apply(self, plugin: Plugin, answer: PluginAnswer, environment: str, environment_id: int) -> None:
        for card in answer.cards:
            self.show(plugin, card, environment_id)
        with self.steps.deeper():
            for line in answer.commands:
                self.run(plugin, line, environment, environment_id)

    def show(self, plugin: Plugin, card: PluginCard, environment_id: int) -> None:
        kind = plugin.manifest.card_kind(card.kind)
        label = self.words.plain(card.label or kind.label)
        data = {"kind": "plugin", "plugin": plugin.name, "card": card.kind, "icon": kind.icon, "tone": card.tone or kind.tone, "detail": self.words.plain(card.detail), "collapsed": kind.collapsed}
        self.cards.keyed(environment_id, card.key, label, data, Actor.plugin(plugin.name))

    def run(self, plugin: Plugin, line: str, environment: str, environment_id: int) -> None:
        argv = shlex.split(line)
        if argv[:1] != ["journal"]:
            self.record(plugin, line, environment_id, 1, "a plugin runs journal commands only")
            return
        outcome = self.console.run(argv[1:], Where(environment or "main", "", False, plugin.name))
        self.record(plugin, line, environment_id, outcome.code, outcome.err.strip()[-300:])

    def record(self, plugin: Plugin, line: str, environment_id: int, code: int, err: str) -> None:
        self.entries.save(Entry(environment_id=environment_id, kind=COMMAND, actor=Actor.plugin(plugin.name), data={"plugin": plugin.name, "command": line, "code": code, "err": err}), Actor.plugin(plugin.name))
