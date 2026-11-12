import pytest

from engine.actor.actor import CORE_ACTOR_ID
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.reader import Reader
from core.modules.processes.support.stock_retirement import StockRetirement

SHIPPED = ("pytest", "vitest")
PROJECT_ACTOR_ID = 4


def reader(name: str, creator_id: int = CORE_ACTOR_ID, shipped_digest: str = "shipped") -> Reader:
    return Reader(name=name, type=ReaderType.PATTERN, commands="x*", creator_id=creator_id, shipped_digest=shipped_digest)


@pytest.mark.parametrize("row, edited, retires", [
    (reader("gone-tool"), False, True),
    (reader("gone-tool"), True, False),
    (reader("pytest"), False, False),
    (reader("gone-tool", PROJECT_ACTOR_ID), False, False),
    (reader("person-tool", shipped_digest=""), False, False),
], ids=["core-made, not shipped, never edited", "edited", "still shipped", "another creator's reader", "a person's reader with the core's number"])
def test_a_stock_row_retires_only_when_the_core_made_it_nobody_edited_it_and_it_is_no_longer_shipped(row, edited, retires):
    assert StockRetirement.retires(row, SHIPPED, edited) is retires
