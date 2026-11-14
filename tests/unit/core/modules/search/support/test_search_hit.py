from dataclasses import dataclass

from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.search.support.search_hit import SearchHit

SAVED_AT = Timestamp.parsed("2026-11-14T10:00:00+00:00")


@dataclass(frozen=True, kw_only=True)
class Note(Model):
    """A row searched over its title, abstract and outcome, the outcome not always written."""

    model_name = "note"
    cli_name = "note"
    search_fields = ["title", "abstract", "outcome"]
    title: str
    abstract: str
    outcome: str | None = None


def test_a_hit_carries_the_rows_title_and_the_rest_of_its_searched_text():
    hit = SearchHit.matched(Note(id=3, created_at=SAVED_AT, title="Shared layouts", abstract="Five layouts draw every page"), ["layouts"])
    assert (hit.title, hit.body) == ("Shared layouts", "Five layouts draw every page")


def test_a_kept_hit_keeps_its_title_and_body():
    hit = SearchHit.matched(Note(id=3, created_at=SAVED_AT, title="Shared layouts", abstract="Five layouts", outcome="Built"), ["layouts"])
    assert SearchHit.restored(hit.stored()) == hit
    assert hit.body == "Five layouts\n\nBuilt"
