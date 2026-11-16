import pytest

from engine.database.database import Database
from engine.database.schema_column import SchemaColumn
from engine.database.schema_columns import SchemaColumns
from engine.errors.refusal import Refusal
from core.modules.agents.support.column_rule import ColumnRule
from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_every_column_of_a_freshly_migrated_journal_keeps_the_column_rule(played):
    story = played(BuilderStarted)
    sets = ColumnRule.sets(SchemaColumns(story.container.get(Database)).columns())
    assert ("tasks", "holder_id") in sets.actor and ("messages", "session_agent_id") in sets.agent and ("environments", "test_agent_id") in sets.agent


@pytest.mark.parametrize("column", [SchemaColumn("tasks", "holder_id", "agents"), SchemaColumn("notes", "agent_owner", None)])
def test_a_column_that_breaks_the_rule_or_cannot_be_placed_is_refused_by_name(column):
    with pytest.raises(Refusal, match=f"{column.table}.{column.column}"):
        ColumnRule.sets([column])


def test_an_agent_column_a_later_migration_points_at_agents_is_an_agent_column_already():
    sets = ColumnRule.sets([SchemaColumn("environments", "test_agent_id", "actors")])
    assert ("environments", "test_agent_id") in sets.agent
