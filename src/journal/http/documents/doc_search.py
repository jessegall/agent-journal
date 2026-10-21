import re

from journal.http.documents.doc_hit import DocHit
from journal.models.doc import Doc
from journal.repositories.docs import Docs

WEIGHTS = {"title": 8, "number": 8, "abstract": 3, "text": 1}
AROUND = 70
SPACES = re.compile(r"\s+")
MARKS = re.compile(r"[*`#]+")


class DocSearch:
    """The documents that hold every word searched for, best first, each with where the words are, as the Documents page's search shows them."""

    def __init__(self, docs: Docs) -> None:
        self.docs = docs

    def located(self, words: str) -> list[DocHit]:
        asked = words.lower().split()
        if not asked:
            return []
        hits = [hit for hit in (self.hit(doc, asked) for doc in self.docs.all()) if hit["score"]]
        return sorted(hits, key=lambda hit: -hit["score"])

    def hit(self, doc: Doc, asked: list[str]) -> DocHit:
        parts = {"title": doc.title.lower(), "number": f"doc {doc.id}", "abstract": doc.abstract.lower(), "text": doc.body.lower()}
        whole = " ".join(parts.values())
        if not all(word in whole for word in asked):
            return DocHit(id=doc.id, score=0, where="", text="")
        found = [part for part, words in parts.items() if any(word in words for word in asked)]
        return DocHit(id=doc.id, score=sum(WEIGHTS[part] for part in found), where=found[0], text=self.passage(doc.body, asked))

    @staticmethod
    def passage(body: str, asked: list[str]) -> str:
        flat = SPACES.sub(" ", MARKS.sub("", body))
        time = min((i for i in (flat.lower().find(word) for word in asked) if i >= 0), default=-1)
        if time < 0:
            return ""
        return flat[max(0, time - AROUND):time + AROUND].strip()
