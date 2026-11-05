from core.base.database.database import Database
from core.base.database.module_migrations import ModuleMigrations
from core.base.database.schema import Schema
from core.base.database.statement import Statement
from core.modules.project_rules.project_rules_module import ProjectRulesModule
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

OLD_TYPE = ("INSERT INTO memory_types (creator_id, name, module, description, starting_weight, created_at, updated_at)"
            " VALUES (1, 'rule', 'journal.core.memories', 'a ruling', 10, '2026-01-01T00:00:00+00:00', '2026-01-01T00:00:00+00:00')")
OLD_MEMORY = ("INSERT INTO memories (environment_id, creator_id, type, text, created_at, updated_at)"
              " VALUES (?, 1, ?, ?, '2026-01-01T00:00:00+00:00', '2026-01-01T00:00:00+00:00')")


def old_memories(story) -> None:
    database = story.container.get(Database)
    database.update(Statement(OLD_TYPE))
    for environment_id, memory_type, text in ((None, "rule", "Name things plainly"), (1, "rule", "Name things plainly"), (1, "rule", "Run the stories"), (None, "fact", "Use cents")):
        database.insert(Statement(OLD_MEMORY, (environment_id, memory_type, text)))
    database.update(Statement("DELETE FROM migrations WHERE module = ? AND number > 1", [ProjectRulesModule.name]))


def test_permanent_memories_become_rules_once_and_leave_the_memories(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('memory make "The cart total is in cents" --type fact --environment main', actor=story.agent)
    old_memories(story)
    migrations = [ModuleMigrations(ProjectRulesModule.name, [migration() for migration in ProjectRulesModule.migrations])]
    schema = story.container.get(Schema)
    expect_value(schema.migrate(migrations), [f"{ProjectRulesModule.name} 2"])
    active_rules = story.run("rule list --state active --json")
    expect_value(active_rules.output_text.count("Name things plainly"), 1)
    active_rules.expect_text("Run the stories")
    active_rules.expect_text("Use cents")
    story.expect_no_text("memory list --environment main --state active", "Run the stories")
    story.expect_text("memory list --environment main", "The cart total is in cents")
    story.expect_refusal('memory make "Name things plainly" --type rule --environment main', "no memory type rule exists")
    expect_value(schema.migrate(migrations), [])


def test_a_memory_for_no_environment_cannot_be_made(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('memory make "Use cents" --type fact', "a memory belongs to one environment")
