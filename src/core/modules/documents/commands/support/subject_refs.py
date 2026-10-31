import re
from collections.abc import Sequence

from core.base.refusal import Refusal

REF = re.compile(r"^[a-z_]+:\d+$")


class SubjectRefs:
    """The rows a report is about, each written table:number, from the words given, spaced or comma-separated."""

    @staticmethod
    def parsed(texts: Sequence[str]) -> tuple[str, ...]:
        subject_refs = tuple(ref for text in texts for ref in text.replace(",", " ").split())
        malformed = [ref for ref in subject_refs if not REF.match(ref)]
        if malformed:
            raise Refusal(f"not a row: {', '.join(malformed)}; write each as plans:8 or tasks:12", "name each row by its table and number")
        return subject_refs
