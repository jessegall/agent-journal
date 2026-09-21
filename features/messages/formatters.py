import re

from features.parts import Context, TextFormatter
from resources.types import TYPES

CODE = re.compile(r"(?<![`\w-])(?:journal\s+([a-z_]+)(?:\s+[a-z_]+)?|--[a-z][a-z-]*)(?![`\w])")


class CommandsAsCode(TextFormatter):
    def format(self, context: Context, text: str) -> str:
        return "`".join(part if at % 2 else CODE.sub(self.command, part) for at, part in enumerate(str(text or "").split("`")))

    def command(self, found) -> str:
        from commands.parser import QUERIES, parser
        if not QUERIES:
            parser()
        noun = found.group(1)
        if noun is None or noun in TYPES:
            return f"`{found.group(0)}`"
        if noun in QUERIES:
            return f"`journal {noun}`{found.group(0)[found.group(0).index(noun) + len(noun):]}"
        return found.group(0)
