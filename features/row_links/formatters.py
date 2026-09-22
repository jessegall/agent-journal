import re
from functools import cache

from engine.markers import MARKER, marked
from features.format import VIEWER
from features.parts import Context, TextFormatter
from resources.types import TYPES

KEPT = re.compile(r"`[^`]*`|" + MARKER.pattern)


@cache
def named() -> tuple[dict[str, str], re.Pattern]:
    names = {spelling: name for name, type_ in TYPES.items() for spelling in (name, type_.details.title.lower()) if spelling}
    return names, re.compile(r"\b(" + "|".join(sorted(map(re.escape, names), key=len, reverse=True)) + r")s?\s+#?(\d+)\b"
                             r"((?:(?:\s*,\s*(?:and\s+)?|\s+and\s+)#?\d+\b)*)", re.IGNORECASE)


def chipped(text: str) -> str:
    names, found = named()

    def chip(m) -> str:
        name, more = names[m.group(1).lower()], re.findall(r"\d+", m.group(3))
        if not more:
            return marked("chip", f"{name}:{m.group(2)}", m.group(0))
        return marked("chips", f"{name}:{','.join([m.group(2), *more])}", m.group(0))

    return found.sub(chip, text)


def outside(pattern: re.Pattern, text: str, change) -> str:
    parts, at = [], 0
    for kept in pattern.finditer(text):
        parts += [change(text[at:kept.start()]), kept.group(0)]
        at = kept.end()
    return "".join([*parts, change(text[at:])])


class MarkRows(TextFormatter):
    surfaces = (VIEWER,)

    def format(self, context: Context, text: str) -> str:
        return outside(KEPT, text, chipped)


EXT = ("py|js|mjs|cjs|ts|tsx|jsx|vue|md|json|css|scss|html|txt|log|yml|yaml|toml|ini|sh|zsh|bash|svg|png|jpg|jpeg|gif|webp|csv|lock|php|cs|"
       "java|go|rs|rb|sql|xml|env|gitignore|prettierrc")
PATH = re.compile(rf"(^|[\s(])((?:/(?:[\w.-]+/)*[\w.-]*\.(?:{EXT}))|(?:\.{{1,2}}/)?(?:[\w.-]+/)*[\w.-]*\.(?:{EXT}))(?=[\s).,;:]|$)")
SHA = re.compile(r"(^|[\s(])([0-9a-f]{7,40})(?=[\s).,;:]|$)")
URL = re.compile(r"\bhttps?://[^\s<>\"'|\]*`]+[^\s<>\"'.,;:)|\]*`]")
DOTFILE = re.compile(r"^\.(gitignore|env|prettierrc)$")
CODE = re.compile(r"`[^`]*`")


def a_file(path: str) -> bool:
    name = path.split("/")[-1]
    return not re.match(r"^https?:|^\d", path) and not path.startswith("//") and bool(re.search(r"[\w-]\.\w+$", name) or DOTFILE.match(name))


def a_commit(sha: str) -> bool:
    return bool(re.search(r"\d", sha) and re.search(r"[a-f]", sha))


def linked(text: str) -> str:
    text = PATH.sub(lambda m: m.group(1) + marked("file", m.group(2), m.group(2).split("/")[-1] if m.group(2).startswith("/") else m.group(2))
                    if a_file(m.group(2)) else m.group(0), text)
    return SHA.sub(lambda m: m.group(1) + marked("commit", m.group(2), m.group(2)[:7]) if a_commit(m.group(2)) else m.group(0), text)


class MarkPaths(TextFormatter):
    surfaces = (VIEWER,)

    def format(self, context: Context, text: str) -> str:
        return outside(CODE, text, lambda part: outside(KEPT, URL.sub(lambda m: marked("url", m.group(0), m.group(0)), part), linked))
