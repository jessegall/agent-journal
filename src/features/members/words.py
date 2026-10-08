import re
from contextlib import contextmanager
from contextvars import ContextVar
from dataclasses import dataclass

from controllers.base import SENDER

from resources.base import OWNER_ID, SECTION, USER, WRITER, Resource

TEXTS = ("title", "abstract", "brief", "outcome")
TAG = re.compile(r"</?untrusted\b[^>]*>")
MEMBER_MARKED = re.compile(r'<untrusted member="[^"]*">(.*?)</untrusted>', re.S)
SOURCE_MARKED = re.compile(r'<untrusted source="[^"]*"(?: author="[^"]*")?>(.*?)</untrusted>', re.S)
IMAGE = re.compile(r"!\[([^\]]*)\]\(([^)\s]*)[^)]*\)")
HTML_IMAGE = re.compile(r"<img\b[^>]*>", re.I)
QUOTE = re.compile(r'["<>]')


@dataclass(frozen=True)
class Outside:
    """The outside source whose words are being saved, such as Linear, and who wrote them there."""

    source: str
    author: str = ""


OUTSIDE: ContextVar[Outside | None] = ContextVar("outside", default=None)


@contextmanager
def words_from(source: str, author: str = ""):
    token = OUTSIDE.set(Outside(source, author))
    try:
        yield
    finally:
        OUTSIDE.reset(token)


def marked(text: str, member: str) -> str:
    """A member's words wrapped as untrusted, with any tag they typed themselves taken out so the wrap cannot be closed early."""
    return f'<untrusted member="{member}">{TAG.sub("", text)}</untrusted>'


def marked_from(text: str, outside: Outside) -> str:
    """Words from an outside source wrapped as untrusted, naming the source and its author, with any tag they typed taken out."""
    author = f' author="{QUOTE.sub("", outside.author)}"' if outside.author else ""
    return f'<untrusted source="{QUOTE.sub("", outside.source)}"{author}>{TAG.sub("", text)}</untrusted>'


def without_images(text: str) -> str:
    """An outside source's words with each image shown as a link, so reading them loads nothing from the source's host."""
    return HTML_IMAGE.sub("(image removed)", IMAGE.sub(lambda found: f"[{found[1] or 'image'} (image)]({found[2]})", text))


def unmarked(text: str, record=None) -> str:
    return MEMBER_MARKED.sub(r"\1", SOURCE_MARKED.sub(lambda found: without_images(found[1]), text))


def texts_of(row: Resource) -> set[str]:
    return {*(getattr(row, name) for name in TEXTS), *(part[key] for part in row.sections for key in (SECTION.title, SECTION.body))}


class MemberWords:
    """Marks the words a member or an outside source writes into a row as untrusted, before any agent can read them; words already in the row stay as they were."""

    def __call__(self, controller, r: Resource) -> None:
        sender, outside = SENDER.get(), OUTSIDE.get()
        if sender is None and outside is None:
            return
        kept = texts_of(controller.rows.peek(r.n)) if controller.rows.exists(r.n) else set()

        def new(text: str) -> str:
            if not text or text in kept:
                return text
            return marked_from(text, outside) if outside else marked(text, sender.member)
        for name in TEXTS:
            setattr(r, name, new(getattr(r, name)))
        r.sections = [{**part, SECTION.title: new(part[SECTION.title]), SECTION.body: new(part[SECTION.body])} for part in r.sections]


class WrittenBy:
    """Names on each row a person makes who made it: the owner, or the member the login page named."""

    def __call__(self, controller, r: Resource) -> None:
        if controller.actor != USER or controller.rows.exists(r.n):
            return
        sender = SENDER.get()
        r.data[WRITER] = OWNER_ID if sender is None else sender.member
