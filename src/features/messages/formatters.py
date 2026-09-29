import re

from features.parts import Context, TextFormatter
from resources.types import TYPES
from features.command_line import command_line

CODE = re.compile(r"(?<![`\w./-])(?:journal\s+([a-z_]+)(?:\s+([a-z_]+))?|--[a-z][a-z-]*)(?![`\w])")
FOREIGN = re.compile(r"[./]\S*\s+$")


class CommandsAsCode(TextFormatter):
    def format(self, context: Context, text: str) -> str:
        return "`".join(part if at % 2 else CODE.sub(self.command, part) for at, part in enumerate(text.split("`")))

    def command(self, found) -> str:
        line = command_line()
        if not line.queries:
            line.parser()
        noun, word = found.group(1), found.group(2)
        if noun is None:
            return found.group(0) if FOREIGN.search(found.string[:found.start()]) else f"`{found.group(0)}`"
        if noun in TYPES:
            if word in line.words(noun):
                return f"`{found.group(0)}`"
            return f"`journal {noun}`" if not word else found.group(0)
        if noun in line.queries:
            return f"`journal {noun}`{found.group(0)[found.group(0).index(noun) + len(noun):]}"
        return found.group(0)
