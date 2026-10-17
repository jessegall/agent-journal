from journal.db.masks import Masks
from journal.features.secrets.output_mask import OutputMask
from journal.models.plugin import Plugin

NEUTRAL = {"[journal]": "(journal)", "[!reply:": "(!reply:"}
"""Marks only the journal and the agent may write, made plain text inside a plugin's words."""


class PluginWords:
    """A plugin's words as they reach the agent or the chat: prefixed with its name, the journal's own marks made plain, and every secret value masked in all its forms."""

    def __init__(self, masks: Masks) -> None:
        self.masks = masks

    def said(self, plugin: Plugin, words: str) -> str:
        return f"[plugin {plugin.name}] {self.plain(words)}"

    def plain(self, words: str) -> str:
        for mark, plain in NEUTRAL.items():
            words = words.replace(mark, plain)
        return OutputMask(self.masks.current()).masked(words.encode()).decode()
