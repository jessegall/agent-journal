from journal.chat.process_card import ProcessCard
from journal.chat.process_cards import ProcessCards
from journal.models.message import Message
from journal.features.plugins.support.plugin_card import PluginCard
from journal.features.plugins.support.plugin_text import PluginText
from journal.models.plugin import Plugin
from journal.support.actor import Actor
from journal.support.card_kind import CardKind


class PluginProcessCard(ProcessCard):
    """The process card of a plugin's card that carries a key: a later card of the same key replaces it where it stands if the user has not written since, else at the bottom of the chat."""

    name = "plugin"

    def __init__(self, cards: ProcessCards, text: PluginText) -> None:
        self.cards, self.text = cards, text

    def show(self, plugin: Plugin, card: PluginCard, environment_id: int, label: str, data: dict) -> None:
        self.cards.show_recent(self.name, environment_id, card.key, label, data, Actor.plugin(plugin.name), CardKind.PLUGINS, False, self.text.plain(card.detail))

    def refresh(self, message: Message) -> dict:
        return {"active": False}
