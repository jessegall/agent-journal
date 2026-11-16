from engine.database.actor_table import ActorTable
from engine.database.database import Database
from engine.database.statement import Statement
from engine.registry.registry import Registry
from engine.row.row_owner import RowOwner
from tests.integration.engine.samples.sample_container import sample_container


def test_actor_table_reset_clears_round_state(tmp_path):
    container = sample_container(tmp_path, Registry("abc", {}, {}, {}, (), ()))
    actors = container.get(ActorTable)
    assert actors.row_owner(5) is None and not actors.is_agent(5)
    container.get(Database).update(Statement("INSERT INTO agents (id, actor_id, role, environment_id) VALUES (5, 5, 'worker', 2)"))
    assert actors.row_owner(5) is None
    actors.reset()
    assert (actors.agent_answers, actors.row_owners) == ({}, {})
    assert actors.row_owner(5) == RowOwner(5, 2)


def test_an_agent_whose_actor_id_differs_is_owned_and_found_by_its_actor_id(tmp_path):
    container = sample_container(tmp_path, Registry("abc", {}, {}, {}, (), ()))
    database = container.get(Database)
    database.update(Statement("INSERT INTO agents (id, actor_id, role, environment_id) VALUES (3, 40, 'worker', 2), (40, 900, 'helper', 5)"))
    actors = container.get(ActorTable)
    assert (actors.row_owner(40), actors.agent_id(40), actors.agent_id(900), actors.agent_id(3)) == (RowOwner(3, 2), 3, 40, None)
