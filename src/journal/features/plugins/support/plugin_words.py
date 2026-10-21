from journal.support.masks import Masks
from journal.support.output_mask import OutputMask
from journal.models.plugin import Plugin

NEUTRAL = {"[journal]": "(journal)", "[!reply:": "(!reply:"}


class PluginWords:
    """A plugin's words as they reach the agent or the chat: prefixed with its name, the journal's own marks made plain, and every secret value masked in all its forms."""

    def __init__(self, masks: Masks) -> None:
        self.masks = masks

    def said(self, plugin: Plugin, text: str) -> str:
        return f"[plugin {plugin.name}] {self.plain(text)}"

    def plain(self, text: str) -> str:
        for mark, plain in NEUTRAL.items():
            text = text.replace(mark, plain)
        return OutputMask(self.masks.current()).masked(text.encode()).decode()
