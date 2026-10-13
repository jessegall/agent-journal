import re

from events.answers import Answer, Rewritten
from events.asking import TextFormatting
from receiving import Answerer
from resources.types import TYPES
from engine.command_line import command_line

NO_NOUN = "queries"
CODE = re.compile(r"(?<![`\w./-])(?:journal\s+([a-z_]+)(?:\s+([a-z_]+))?|--[a-z][a-z-]*)(?![`\w])")


def after_path(text: str, at: int) -> bool:
    before = text[:at]
    kept = before.rstrip()
    if kept == before or not kept:
        return False
    word = kept.rsplit(None, 1)[-1]
    return "." in word or "/" in word


class CommandsAsCode(Answerer[TextFormatting]):
    def answer(self, request: TextFormatting) -> Answer:
        return Rewritten("`".join(part if at % 2 else CODE.sub(self.command, part) for at, part in enumerate(request.text.split("`"))))

    def command(self, found) -> str:
        line = command_line()
        if not line.queries:
            line.parser(NO_NOUN)
        noun, word = found.group(1), found.group(2)
        if noun is None:
            return found.group(0) if after_path(found.string, found.start()) else f"`{found.group(0)}`"
        if noun in TYPES:
            if word in line.words(noun):
                return f"`{found.group(0)}`"
            return f"`journal {noun}`" if not word else found.group(0)
        if noun in line.queries:
            return f"`journal {noun}`{found.group(0)[found.group(0).index(noun) + len(noun):]}"
        return found.group(0)
