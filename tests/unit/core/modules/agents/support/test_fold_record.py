import json
from types import SimpleNamespace

from core.modules.agents.support.fold_record import FoldRecord

KEPT = SimpleNamespace(read=lambda query, loader, name: loader())


class FakeFoldQuery:
    """Folded main rows, filtered and ordered the way the fold record reads them."""

    def __init__(self, folds: list[SimpleNamespace]) -> None:
        self.folds = folds

    def filter(self, **values: object) -> "FakeFoldQuery":
        return FakeFoldQuery([fold for fold in self.folds if all(getattr(fold, name) == value for name, value in values.items())])

    def matching(self, condition: object) -> "FakeFoldQuery":
        return self

    def first(self) -> SimpleNamespace | None:
        return self.folds[0] if self.folds else None

    def every_row(self, reason: str):
        return iter(self.folds)


def fold(folded_agent_id: int, number: int, session: str, past_session: str, environment_id: int = 1, survivor_id: int = 78) -> SimpleNamespace:
    return SimpleNamespace(environment_id=environment_id, folded_agent_id=folded_agent_id, survivor_id=survivor_id, folded_number=number,
                           agent_row=json.dumps({"id": folded_agent_id, "session": session}), sessions=json.dumps([{"session": past_session}]))


RECORD = FoldRecord(SimpleNamespace(query=lambda model: FakeFoldQuery([fold(894, 1, "s-894", "s-old"), fold(893, 29, "s-893", "s-older")])), KEPT)


def test_an_old_agent_id_resolves_to_the_survivor_and_any_other_id_stays_itself():
    assert (RECORD.agent_id(894), RECORD.agent_id(12)) == (78, 12)


def test_an_old_number_in_its_environment_resolves_to_the_survivor():
    assert (RECORD.number_holder(1, 29), RECORD.number_holder(2, 29), RECORD.number_holder(1, 40)) == (78, None, None)


def test_an_old_session_of_a_folded_row_or_of_its_past_sessions_resolves_to_the_survivor():
    assert (RECORD.session_holder(1, "s-893"), RECORD.session_holder(1, "s-older"), RECORD.session_holder(1, "s-new")) == (78, 78, None)


def test_many_ids_resolve_in_one_read_each_folded_one_to_the_survivor():
    assert RECORD.agent_ids({894, 12}) == {894: 78, 12: 12}
