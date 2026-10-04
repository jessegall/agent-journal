from features.parts import Context, TextFormatter
from features.command_tags.reading import reader, visible


class StripTags(TextFormatter):
    def format(self, context: Context, text: str) -> str:
        return visible(text, reader(context.settings)) if context.record else visible(text)
