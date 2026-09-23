import re
from functools import cache
from pathlib import Path

from engine.markers import MARKER, marked
from engine.project_files import matching
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
        numbers = [m.group(2), *more]
        word = m.group(0)[:m.start(2) - m.start(0)].rstrip(" #")
        return marked("chips", f"{name}:{','.join(numbers)}", f"{word} {', '.join(numbers)}")

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


def resolved(project: Path, path: str) -> str:
    if "/" not in path:
        found = matching(project, path)
        return found[0] if len(found) == 1 else ""
    return path


def existing(project: Path, path: str) -> str:
    if "/" not in path:
        return resolved(project, path)
    return path if (project / path).is_file() or Path(path).is_file() else ""


def filed(m, project: Path) -> str:
    path = m.group(2)
    value = resolved(project, path) if a_file(path) else ""
    return m.group(1) + marked("file", value, path.split("/")[-1] if path.startswith("/") else path) if value else m.group(0)


def linked(text: str, project: Path) -> str:
    text = PATH.sub(lambda m: filed(m, project), text)
    return SHA.sub(lambda m: m.group(1) + marked("commit", m.group(2), m.group(2)[:7]) if a_commit(m.group(2)) else m.group(0), text)


def coded(span: str, project: Path) -> str:
    path = span.strip("`").strip()
    value = existing(project, path) if a_file(path) and PATH.fullmatch(path) else ""
    return marked("file", value, path) if value else span


class MarkPaths(TextFormatter):
    surfaces = (VIEWER,)

    def format(self, context: Context, text: str) -> str:
        project = context.record.root.parent
        return "".join(coded(part, project) if CODE.fullmatch(part) else
                       outside(KEPT, URL.sub(lambda m: marked("url", m.group(0), m.group(0)), part), lambda rest: linked(rest, project))
                       for part in re.split(r"(`[^`]*`)", text))
