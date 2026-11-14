from engine.database.actor_table import ActorTable
from engine.database.database import Database
from engine.database.statement import Statement
from engine.registry.registry import Registry
from engine.row.row_owner import RowOwner
from tests.unit.engine.samples.sample_container import sample_container


def test_actor_table_reset_clears_round_state(tmp_path):
    container = sample_container(tmp_path, Registry("abc", {}, {}, {}, (), ()))
    actors = container.get(ActorTable)
    assert actors.row_owner(5) is None and not actors.is_agent(5)
    container.get(Database).update(Statement("INSERT INTO agents (id, role, environment_id) VALUES (5, 'worker', 2)"))
    assert actors.row_owner(5) is None
    actors.reset()
    assert (actors.agent_answers, actors.row_owners) == ({}, {})
    assert actors.row_owner(5) == RowOwner(5, 2)
