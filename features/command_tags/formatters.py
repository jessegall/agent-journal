from features.parts import Context, TextFormatter
from features.command_tags.reading import stripped, visible


class StripTags(TextFormatter):
    def format(self, context: Context, text: str) -> str:
        return stripped(text, context.settings) if context.record else visible(text)
