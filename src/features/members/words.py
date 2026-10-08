import re

from controllers.base import WRITING_MEMBER
from features.hosted_journal.owner import OWNER
from resources.base import SECTION, USER, WRITER, Resource

TEXTS = ("title", "abstract", "brief", "outcome")
TAG = re.compile(r"</?untrusted\b[^>]*>")
MARKED = re.compile(r'<untrusted member="[^"]*">(.*?)</untrusted>', re.S)


def marked(text: str, member: str) -> str:
    """A member's words wrapped as untrusted, with any tag they typed themselves taken out so the wrap cannot be closed early."""
    return f'<untrusted member="{member}">{TAG.sub("", text)}</untrusted>'


def unmarked(text: str, record=None) -> str:
    return MARKED.sub(r"\1", text)


def texts_of(row: Resource) -> set[str]:
    return {*(getattr(row, name) for name in TEXTS), *(part[key] for part in row.sections for key in (SECTION.title, SECTION.body))}


class MemberWords:
    """Marks the words a member writes into a row as untrusted, before any agent can read them; words already in the row stay as they were."""

    def __call__(self, controller, r: Resource) -> None:
        member = WRITING_MEMBER.get()
        if member is None:
            return
        kept = texts_of(controller.rows.peek(r.n)) if controller.rows.exists(r.n) else set()

        def new(text: str) -> str:
            return text if not text or text in kept else marked(text, member)
        for name in TEXTS:
            setattr(r, name, new(getattr(r, name)))
        r.sections = [{**part, SECTION.title: new(part[SECTION.title]), SECTION.body: new(part[SECTION.body])} for part in r.sections]


class WrittenBy:
    """Names on each row a person makes who made it: the owner, or the member the login page named."""

    def __call__(self, controller, r: Resource) -> None:
        if controller.actor != USER or controller.rows.exists(r.n):
            return
        member = WRITING_MEMBER.get()
        r.data[WRITER] = OWNER if member is None else member
