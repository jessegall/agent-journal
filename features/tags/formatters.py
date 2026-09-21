from features.parts import Context, TextFormatter
from features.tags.reading import ANY, reader


class StripTags(TextFormatter):
    def format(self, context: Context, text: str) -> str:
        return (reader(context.settings) if context.record else ANY).sub(lambda found: found.group(1) or "", str(text or ""))
