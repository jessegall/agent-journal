import pytest

from core.base.actor import Actor, ActorType
from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.registry.dotted_path import DottedPath
from core.base.registry.registry import Registry
from core.base.refusal import Refusal
from core.base.refusal_log import RefusalLog
from tests.core.base.harness import harness
from tests.core.base.test_bus import LoanRefused, LoanRefusedHandler

AGENT = Actor(7, ActorType.AGENT)


def test_a_refused_command_leaves_no_change_and_one_refusal_row(tmp_path):
    registry = Registry("abc", {}, {DottedPath.class_path(LoanRefused).text: DottedPath.class_path(LoanRefusedHandler)}, {}, (), ())
    container = harness(tmp_path, registry)
    database = container.get(Database)
    with pytest.raises(Refusal) as caught:
        container.get(Bus).run(LoanRefused(title="Emma"), AGENT)
    container.get(RefusalLog).record(AGENT, "LoanRefused", caught.value)
    assert database.rows(Statement("SELECT count(*) FROM loans"))[0][0] == 0
    refusals = database.rows(Statement("SELECT actor_id, command, guard, reason FROM refusals"))
    assert [tuple(row) for row in refusals] == [(7, "LoanRefused", "", "no more loans today")]
