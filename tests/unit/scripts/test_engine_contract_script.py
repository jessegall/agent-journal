import json

from scripts.engine_contract import SNAPSHOT, contract, engine_version, needed_move

PINNED = {"model.Model": {"bases": [], "fields": ["id: int"], "methods": ["save(self) -> None"]}}


def test_the_snapshot_holds_the_live_contract_or_the_version_moved_by_the_rule():
    copy = json.loads(SNAPSHOT.read_text())
    assert needed_move(copy["classes"], contract(), copy["engine_version"], engine_version()) is None


def test_a_removed_field_without_a_major_move_is_refused():
    current = {"model.Model": {"bases": [], "fields": [], "methods": ["save(self) -> None"]}}
    assert "raise the major number" in needed_move(PINNED, current, "5.0.0", "5.1.0")
    assert needed_move(PINNED, current, "5.0.0", "6.0.0") is None


def test_an_addition_needs_a_minor_move_and_passes_with_one():
    current = {"model.Model": {"bases": [], "fields": ["id: int", "title: str"], "methods": ["save(self) -> None"]}}
    assert "raise the minor number" in needed_move(PINNED, current, "5.0.0", "5.0.1")
    assert needed_move(PINNED, current, "5.0.0", "5.1.0") is None
