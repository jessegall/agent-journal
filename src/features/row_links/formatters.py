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
def named(places: tuple = ()) -> tuple[dict[str, str], re.Pattern]:
    names = {spelling: name for name, type_ in TYPES.items() for spelling in (name, type_.details.title.lower()) if spelling}
    spelled = "|".join(sorted(map(re.escape, names), key=len, reverse=True))
    where = "|".join(sorted(map(re.escape, places), key=len, reverse=True)) or r"(?!)"
    return names, re.compile(rf"(?:\b({where})\s+)?\b({spelled})s?\s+#?(\d+)\b"
                             r"((?:(?:\s*,\s*(?:and\s+)?|\s+and\s+)#?\d+\b)*)"
                             rf"(?:\s+in\s+({where})\b)?", re.IGNORECASE)


def environments(record) -> tuple:
    from controllers.types import Environments
    from resources.base import SYSTEM
    return tuple(row["title"] for row in Environments(record, actor=SYSTEM).summaries() if not row["deleted"] and row["title"] != record.env)


def exists(record, env: str, name: str, n: int) -> bool:
    from controllers.types import CONTROLLERS
    from engine.record import Record
    from resources.base import SYSTEM
    return CONTROLLERS[name](Record(record.root, env) if env else record, actor=SYSTEM)._exists(n)


def chipped(text: str, record=None) -> str:
    places = environments(record) if record is not None else ()
    names, found = named(places)

    def chip(m) -> str:
        name, env = names[m.group(2).lower()], m.group(1) or m.group(5) or ""
        numbers = [m.group(3), *re.findall(r"\d+", m.group(4))]
        if record is not None and not all(exists(record, env, name, int(n)) for n in numbers):
            return m.group(0)
        ref = lambda n: f"{name}:{n}@{env}" if env else f"{name}:{n}"
        if len(numbers) == 1:
            return marked("chip", ref(numbers[0]), m.group(0))
        chips = [marked("chip", ref(n), f"{m.group(2)} {n}") for n in numbers]
        there = f" in {env}" if env else ""
        return f"{', '.join(chips[:-1])} and {chips[-1]}{there}"

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
        return outside(KEPT, text, lambda part: chipped(part, context.record))


EXT = ("py|js|mjs|cjs|ts|tsx|jsx|vue|md|json|css|scss|html|txt|log|yml|yaml|toml|ini|sh|zsh|bash|svg|png|jpg|jpeg|gif|webp|csv|lock|php|cs|"
       "java|go|rs|rb|sql|xml|env|gitignore|prettierrc")
PATH = re.compile(rf"(^|[\s(])((?:/(?:[\w.-]+/)*[\w.-]*\.(?:{EXT}))|(?:\.{{1,2}}/)?(?:[\w.-]+/)*[\w.-]*\.(?:{EXT}))(:\d+(?:-\d+)?)?(?=[\s).,;:]|$)")
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


def labels(paths: list[str]) -> dict[str, str]:
    unique = list(dict.fromkeys(paths))
    tail = lambda path, k: "/".join(path.strip("/").split("/")[-k:])
    out = {}
    for path in unique:
        k = next((k for k in range(1, path.count("/") + 2) if not any(tail(other, k) == tail(path, k) for other in unique if other != path)),
                 path.count("/") + 1)
        out[path] = tail(path, k)
    return out


def chip(value: str, line: str, names: dict[str, str]) -> str:
    number = line.lstrip(":").split("-")[0]
    return marked("file", f"{value}#L{number}" if number else value, f"{names.get(value, value)}{line}")


def found(part: str, project: Path) -> list[str]:
    if CODE.fullmatch(part):
        m = PATH.fullmatch(part.strip("`").strip())
        return [value] if m and a_file(m.group(2)) and (value := existing(project, m.group(2))) else []
    return [value for m in PATH.finditer(part) if a_file(m.group(2)) and (value := resolved(project, m.group(2)))]


def filed(m, project: Path, names: dict[str, str]) -> str:
    value = resolved(project, m.group(2)) if a_file(m.group(2)) else ""
    return m.group(1) + chip(value, m.expand(r"\3"), names) if value else m.group(0)


def linked(text: str, project: Path, names: dict[str, str]) -> str:
    text = PATH.sub(lambda m: filed(m, project, names), text)
    return SHA.sub(lambda m: m.group(1) + marked("commit", m.group(2), m.group(2)[:7]) if a_commit(m.group(2)) else m.group(0), text)


def coded(span: str, project: Path, names: dict[str, str]) -> str:
    m = PATH.fullmatch(span.strip("`").strip())
    value = existing(project, m.group(2)) if m and a_file(m.group(2)) else ""
    return chip(value, m.expand(r"\3"), names) if value else span


class MarkPaths(TextFormatter):
    surfaces = (VIEWER,)

    def format(self, context: Context, text: str) -> str:
        project = context.record.root.parent
        parts = re.split(r"(`[^`]*`)", text)
        names = labels([value for part in parts for value in found(part, project)])
        return "".join(coded(part, project, names) if CODE.fullmatch(part) else
                       outside(KEPT, URL.sub(lambda m: marked("url", m.group(0), m.group(0)), part), lambda rest: linked(rest, project, names))
                       for part in parts)


ONE = MARKER.pattern.replace("(", "(?:").replace("(?:?:", "(?:")
WRAPPED = re.compile(rf"\((\s*{ONE}(?:\s*(?:,|and|,\s*and)\s*{ONE})*\s*)\)")


class UnwrapChips(TextFormatter):
    surfaces = (VIEWER,)

    def format(self, context: Context, text: str) -> str:
        return WRAPPED.sub(lambda m: m.group(1).strip(), text)
