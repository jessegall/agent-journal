import re
from dataclasses import dataclass
from functools import cache

from engine.markers import MARKER, marked
from engine.memo import Memo
from features.format import SHARED, VIEWER
from features.parts import Context, TextFormatter
from resources.types import TYPES

KEPT = re.compile(r"`[^`]*`|" + MARKER.pattern)
CODE = re.compile(r"`[^`]*`")


@cache
def named(places: tuple = ()) -> tuple[dict[str, str], re.Pattern]:
    names = {spelling: name for name, type_ in TYPES.items() for spelling in (name, type_.details.title.lower()) if spelling}
    spelled = "|".join(sorted(map(re.escape, names), key=len, reverse=True))
    where = "|".join(sorted(map(re.escape, places), key=len, reverse=True)) or r"(?!)"
    return names, re.compile(rf"(?:\b(?P<place>{where})\s+)?\b(?P<kind>{spelled})s?\s+#?(?P<n>\d+)\b"
                             r"(?P<more>(?:(?:\s*,\s*(?:and\s+)?|\s+and\s+)#?\d+\b)*)"
                             rf"(?:\s+in\s+(?P<within>{where})\b)?", re.IGNORECASE)


@dataclass(frozen=True)
class Mention:
    name: str
    spelled: str
    env: str | None
    numbers: tuple[str, ...]

    @classmethod
    def of(cls, m: re.Match, names: dict[str, str]) -> "Mention":
        return cls(names[m["kind"].lower()], m["kind"], m["place"] or m["within"], (m["n"], *re.findall(r"\d+", m["more"])))

    def ref(self, n: str) -> str:
        return f"{self.name}:{n}" if self.env is None else f"{self.name}:{n}@{self.env}"


ENVIRONMENT_NAMES = Memo()


def environments(record) -> tuple:
    from controllers.types import Environments
    from resources.base import SYSTEM
    rows = Environments(record, actor=SYSTEM).rows.summaries()
    return ENVIRONMENT_NAMES.get(str(record.home), rows, lambda: tuple(row["title"] for row in rows if not row["deleted"] and row["title"] != record.env))


def exists(record, env: str | None, name: str, n: int) -> bool:
    from controllers.types import CONTROLLERS
    from engine.record import Record
    from resources.base import SYSTEM
    return CONTROLLERS[name](record if env is None else Record(record.root, env), actor=SYSTEM).rows.exists(n)


def chipped(text: str, record=None) -> str:
    if not named()[1].search(text):
        return text
    places = environments(record) if record is not None else ()
    names, found = named(places)

    def chip(m) -> str:
        said = Mention.of(m, names)
        if record is not None and not all(exists(record, said.env, said.name, int(n)) for n in said.numbers):
            return m.group(0)
        if len(said.numbers) == 1:
            return marked("chip", said.ref(said.numbers[0]), m.group(0))
        chips = [marked("chip", said.ref(n), f"{said.spelled} {n}") for n in said.numbers]
        there = "" if said.env is None else f" in {said.env}"
        return f"{', '.join(chips[:-1])} and {chips[-1]}{there}"

    return found.sub(chip, text)


def outside(pattern: re.Pattern, text: str, change, keep=lambda kept: kept) -> str:
    parts, at = [], 0
    for kept in pattern.finditer(text):
        parts += [change(text[at:kept.start()]), keep(kept.group(0))]
        at = kept.end()
    return "".join([*parts, change(text[at:])])


def spanned(kept: str, record) -> str:
    if not CODE.fullmatch(kept):
        return kept
    linked = chipped(kept.strip("`").strip(), record)
    return linked if MARKER.fullmatch(linked) else kept


class MarkRows(TextFormatter):
    surfaces = (VIEWER, SHARED)

    def format(self, context: Context, text: str) -> str:
        return outside(KEPT, text, lambda part: chipped(part, context.record), lambda kept: spanned(kept, context.record))


ONE = MARKER.pattern.replace("(", "(?:").replace("(?:?:", "(?:")
WRAPPED = re.compile(rf"\((\s*{ONE}(?:\s*(?:,|and|,\s*and)\s*{ONE})*\s*)\)")


class UnwrapChips(TextFormatter):
    surfaces = (VIEWER, SHARED)

    def format(self, context: Context, text: str) -> str:
        return WRAPPED.sub(lambda m: m.group(1).strip(), text)
