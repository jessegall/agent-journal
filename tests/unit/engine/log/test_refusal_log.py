import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.database.database import Database
from engine.database.statement import Statement
from engine.dotted_path.dotted_path import DottedPath
from core.base.registry.registry import Registry
from engine.errors.refusal import Refusal
from engine.log.refusal_log import RefusalLog
from tests.unit.core.base.sample_container import sample_container
from tests.unit.engine.command.test_bus import BlockedItem, BlockedItemHandler

AGENT = Actor(7, ActorType.AGENT)


def test_a_refused_command_leaves_no_change_and_one_refusal_row(tmp_path):
    registry = Registry("abc", {}, {DottedPath.class_path(BlockedItem).text: DottedPath.class_path(BlockedItemHandler)}, {}, (), ())
    container = sample_container(tmp_path, registry)
    database = container.get(Database)
    with pytest.raises(Refusal) as raised:
        container.get(Bus).run(BlockedItem(title="Emma"), AGENT)
    container.get(RefusalLog).record(AGENT, "BlockedItem", raised.value)
    assert database.rows(Statement("SELECT count(*) FROM items"))[0][0] == 0
    refusals = database.rows(Statement("SELECT actor_id, command, guard, reason FROM refusals"))
    assert [tuple(row) for row in refusals] == [(7, "BlockedItem", "", "no more items today")]
