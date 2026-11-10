from engine.database.database import Database
from engine.database.module_migrations import ModuleMigrations
from engine.database.schema import Schema
from engine.database.statement import Statement
from core.modules.project_rules.project_rules_module import ProjectRulesModule
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

OLD_SHAPE = ("CREATE TABLE memory_types (name TEXT PRIMARY KEY)", "CREATE TABLE memory_type_switches (id INTEGER PRIMARY KEY)",
             "INSERT INTO memory_types (name) VALUES ('fact'), ('rule')", "ALTER TABLE memories ADD COLUMN type TEXT NOT NULL DEFAULT 'fact'")
OLD_MEMORY = ("INSERT INTO memories (environment_id, creator_id, type, text, created_at, updated_at)"
              " VALUES (1, 1, 'rule', ?, '2026-01-01T00:00:00+00:00', '2026-01-01T00:00:00+00:00')")


def old_memories(story) -> None:
    database = story.container.get(Database)
    for statement in OLD_SHAPE:
        database.update(Statement(statement))
    for text in ("Name things plainly", "Name things plainly", "Run the stories"):
        database.insert(Statement(OLD_MEMORY, [text]))
    database.update(Statement("DELETE FROM migrations WHERE module = ? AND number > 1", [ProjectRulesModule.name]))


def test_permanent_memories_become_rules_once_and_leave_the_memories(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('memory make "The cart total is in cents" --environment main', actor=story.agent)
    old_memories(story)
    migrations = [ModuleMigrations(ProjectRulesModule.name, [migration() for migration in ProjectRulesModule.migrations])]
    schema = story.container.get(Schema)
    expect_value(schema.migrate(migrations), [f"{ProjectRulesModule.name} 2", f"{ProjectRulesModule.name} 3"])
    active_rules = story.run("rule list --state active --json")
    expect_value(active_rules.output_text.count("Name things plainly"), 1)
    active_rules.expect_text("Run the stories")
    story.expect_no_text("memory list --environment main --state active", "Run the stories")
    story.expect_text("memory list --environment main", "The cart total is in cents")
    expect_value(schema.migrate(migrations), [])


def test_a_memory_for_no_environment_cannot_be_made(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('memory make "Use cents"', "a memory needs an environment")
