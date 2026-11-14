from engine.database.database import Database
from engine.database.schema import Schema
from engine.registry.registry import Registry
from tests.stories.core.modules.drivers.support.agent_state_modules import PATH
from tests.stories.core.support.fixtures import MainEnvironment


def test_syncing_a_module_with_an_agent_state_adds_no_model_and_no_migration(new_story):
    story = new_story(fixture=MainEnvironment)
    models = set(Registry.read(story.container.get(Database)).models)
    migrations = story.container.get(Schema).applied_numbers()
    story.expect_sync_success(f"{PATH}:StateModuleJoining")
    registry = Registry.read(story.container.get(Database))
    story.expect_rows(set(registry.models) == models, story.container.get(Schema).applied_numbers() == migrations,
                      "acme.state" in [state.name for state in registry.agent_states])
