import re

from journal.http.documents.doc_hit import DocHit
from journal.models.doc import Doc
from journal.repositories.docs import Docs

WEIGHTS = {"title": 8, "number": 8, "abstract": 3, "text": 1}
SNIPPET_RADIUS_CHARACTERS = 70
SPACES = re.compile(r"\s+")
MARKDOWN_SYMBOLS = re.compile(r"[*`#]+")


class DocSearch:
    """The documents that hold every word searched for, best first, each with where the words are, as the Documents page's search shows them."""

    def __init__(self, docs: Docs) -> None:
        self.docs = docs

    def located(self, text: str) -> list[DocHit]:
        requested = text.lower().split()
        if not requested:
            return []
        hits = [hit for hit in (self.hit(doc, requested) for doc in self.docs.all()) if hit["score"]]
        return sorted(hits, key=lambda hit: -hit["score"])

    def hit(self, doc: Doc, requested: list[str]) -> DocHit:
        parts = {"title": doc.title.lower(), "number": f"doc {doc.id}", "abstract": doc.abstract.lower(), "text": doc.body.lower()}
        full = " ".join(parts.values())
        if not all(word in full for word in requested):
            return DocHit(id=doc.row_id, score=0, place="", text="")
        rows = [part for part, text in parts.items() if any(word in text for word in requested)]
        return DocHit(id=doc.row_id, score=sum(WEIGHTS[part] for part in rows), place=rows[0], text=self.passage(doc.body, requested))

    @staticmethod
    def passage(body: str, requested: list[str]) -> str:
        flat = SPACES.sub(" ", MARKDOWN_SYMBOLS.sub("", body))
        time = min((i for i in (flat.lower().find(word) for word in requested) if i >= 0), default=-1)
        if time < 0:
            return ""
        return flat[max(0, time - SNIPPET_RADIUS_CHARACTERS):time + SNIPPET_RADIUS_CHARACTERS].strip()
