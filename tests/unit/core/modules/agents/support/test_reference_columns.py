import pytest

from engine.database.schema_columns import SchemaColumn
from engine.errors.refusal import Refusal
from core.modules.agents.support.reference_columns import ReferenceColumns


def column(table: str, name: str, target: str | None = None) -> SchemaColumn:
    return SchemaColumn(table, name, target)


def test_foreign_keys_to_agents_and_actors_unkeyed_agent_ids_and_model_pairs_are_found():
    schema = [column("tasks", "holder_id", "agents"), column("tasks", "creator_id", "actors"), column("tasks", "environment_id", "environments"),
              column("events", "actor_id"), column("events", "row_table"), column("events", "row_id"), column("events", "name"),
              column("links", "subject_model"), column("links", "subject_id"), column("plans", "worker_agent_id")]
    found = ReferenceColumns.agent_columns(schema)
    assert found.plain == (("events", "actor_id"), ("plans", "worker_agent_id"), ("tasks", "creator_id"), ("tasks", "holder_id"))
    assert found.pairs == (("events", "row_table", "row_id"), ("links", "subject_model", "subject_id"))


def test_a_key_to_another_table_is_not_an_agent_column_even_with_an_agent_name():
    schema = [column("checks", "creator_id", "environments")]
    assert ReferenceColumns.agent_columns(schema).plain == ()


def test_the_fold_record_tables_are_left_out():
    schema = [column("agent_folds", "survivor_id"), column("agent_fold_rows", "fold_id", "agent_folds")]
    assert ReferenceColumns.agent_columns(schema).plain == ()


def test_an_agent_like_column_that_cannot_be_placed_is_refused():
    with pytest.raises(Refusal, match="sessions.agent_label"):
        ReferenceColumns.agent_columns([column("sessions", "agent_label")])


def test_the_terminal_an_agent_row_launched_from_is_the_launchers_key_and_no_agent_column():
    assert ReferenceColumns.agent_columns([column("agents", "launch_agent_id")]).plain == ()
