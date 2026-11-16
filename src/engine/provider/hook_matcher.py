import re
from dataclasses import dataclass

from engine.provider.enums.matcher_style import MatcherStyle

NAME_CHARACTERS = re.compile(r"[A-Za-z0-9_\-, |]+")
NAME_SEPARATORS = re.compile(r"[,|]")


@dataclass(frozen=True)
class HookMatcher:
    """A hook entry's matcher, read the way its program reads it: empty or '*' matches every name; under the
    names-or-regex style a matcher of name characters only is an exact name or a list split on ',' and '|',
    and any other matcher is a regex searched anywhere in the name; an invalid regex matches nothing."""

    text: str
    style: MatcherStyle

    def matches(self, name: str) -> bool:
        if self.text in ("", "*"):
            return True
        if self.style is MatcherStyle.NAMES_OR_REGEX and NAME_CHARACTERS.fullmatch(self.text):
            return name in (part.strip() for part in NAME_SEPARATORS.split(self.text))
        try:
            return re.search(self.text, name) is not None
        except re.error:
            return False
