import re

from resources.markers import MARKER, marked
from resources.memo import Memo
from events.answers import Allowed, Answer, Rewritten
from events.asking import TextFormatting
from framework.format import SHARED, VIEWER
from receiving import Answerer
from resources.mentions import Mention, named
from serving import ReadElsewhere

KEPT = re.compile(r"`[^`]*`|" + MARKER.pattern)
CODE = re.compile(r"`[^`]*`")
DIGIT = re.compile(r"\d")


ENVIRONMENT_NAMES = Memo()


def environments(record) -> tuple:
    from controllers.types import Environments
    from resources.base import SYSTEM
    rows = Environments(record, actor=SYSTEM).rows.summaries()
    return ENVIRONMENT_NAMES.get(str(record.home), rows, lambda: tuple(row.title for row in rows if not row.deleted and row.title != record.env))


def exists(record, env: str | None, name: str, n: int) -> bool:
    from controllers.types import CONTROLLERS
    from resources.base import SYSTEM
    controller = CONTROLLERS[name](record, actor=SYSTEM)
    return (controller if env is None else controller.in_env(env)).rows.exists(n)


def chipped(text: str, record=None) -> str:
    if not named()[1].search(text):
        return text
    places = environments(record) if record is not None else ()
    names, found = named(places)

    def chip(m) -> str:
        mention = Mention.of(m, names)
        if record is not None and not all(exists(record, mention.env, mention.name, int(n)) for n in mention.numbers):
            return m.group(0)
        if len(mention.numbers) == 1:
            return marked("chip", mention.ref(mention.numbers[0]), m.group(0))
        chips = [marked("chip", mention.ref(n), f"{mention.spelled} {n}") for n in mention.numbers]
        there = "" if mention.env is None else f" in {mention.env}"
        joined = "en" if re.search(r"\ben\b", m["more"]) else "and"
        return f"{', '.join(chips[:-1])} {joined} {chips[-1]}{there}"

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


class MarkRows(Answerer[TextFormatting]):
    surfaces = (VIEWER, SHARED)

    def answer(self, request: TextFormatting, elsewhere: ReadElsewhere) -> Answer:
        if request.surface not in self.surfaces or not DIGIT.search(request.text):
            return Allowed()
        record = elsewhere.here().record
        return Rewritten(outside(KEPT, request.text, lambda part: chipped(part, record), lambda kept: spanned(kept, record)))


ONE = MARKER.pattern.replace("(", "(?:").replace("(?:?:", "(?:")
WRAPPED = re.compile(rf"\((\s*{ONE}(?:\s*(?:,|and|,\s*and)\s*{ONE})*\s*)\)")


class UnwrapChips(Answerer[TextFormatting]):
    surfaces = (VIEWER, SHARED)

    def answer(self, request: TextFormatting) -> Answer:
        return Rewritten(WRAPPED.sub(lambda m: m.group(1).strip(), request.text)) if request.surface in self.surfaces else Allowed()
