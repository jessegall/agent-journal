import re
from dataclasses import dataclass

from resources.base import SECTION, Resource

WEIGHTS = {"title": 8, "number": 8, "abstract": 3, "brief": 2, "section": 1, "file": 1}
AROUND = 70
CHIP = re.compile(r"\[\[\w+ [^|\]]*\|([^\]]*)\]\]")
PLAIN_CHIP = re.compile(r"\[\[\w+ ([^\]]*)\]\]")
MARKS = re.compile(r"[*`]+")
SPACES = re.compile(r"\s+")


@dataclass(frozen=True)
class DocHit:
    """A document that holds every word searched for: how well it matches, and where the words are, with the passage around them."""

    n: int
    score: int
    where: str = ""
    text: str = ""


def terms(query: str) -> list[str]:
    return query.lower().split()


def has(text: str, words: list[str]) -> bool:
    return any(word in text.lower() for word in words)


def plain(text: str) -> str:
    return SPACES.sub(" ", MARKS.sub("", PLAIN_CHIP.sub(r"\1", CHIP.sub(r"\1", text))))


def excerpt(text: str, words: list[str]) -> str:
    flat = plain(text)
    found = [at for at in (flat.lower().find(word) for word in words) if at >= 0]
    if not found:
        return ""
    at = min(found)
    start = max(0, at - AROUND)
    end = at + AROUND * 2
    return f"{'…' if start else ''}{flat[start:end].strip()}{'…' if end < len(flat) else ''}"


def located(row: Resource, words: list[str]) -> DocHit | None:
    files = list(row.files.items())
    places = [("title", row.title), ("abstract", row.abstract), ("brief", row.brief),
              *(("section", f"{section[SECTION.title]}\n{section[SECTION.body]}") for section in row.sections),
              *(("file", f"{name} {about}") for name, about in files), ("number", f"doc {row.n}")]
    haystack = "\n".join(text for _, text in places).lower()
    if not all(word in haystack for word in words):
        return None
    score = sum(WEIGHTS[where] for where, text in places if has(text, words))
    if has(row.title, words) or has(row.abstract, words):
        return DocHit(row.n, score)
    section = next((section for section in row.sections if has(f"{section[SECTION.title]}\n{section[SECTION.body]}", words)), None)
    if section:
        body, title = section[SECTION.body], section[SECTION.title]
        return DocHit(row.n, score, title, excerpt(body if has(body, words) else title, words))
    attached = next((name for name, about in files if has(f"{name} {about}", words)), None)
    if attached:
        return DocHit(row.n, score, "Attached file", attached)
    return DocHit(row.n, score, "", excerpt(row.brief, words))
