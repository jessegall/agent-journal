from engine.database.schema import Schema
from engine.registry.registry import Registry
from tests.stories.core.modules.drivers.support.agent_state_modules import PATH


def test_syncing_a_module_with_an_agent_state_adds_no_model_and_no_migration(journal):
    models = set(Registry.read(journal.database).models)
    migrations = journal.container.get(Schema).applied_numbers()
    journal.expect_sync_success(f"{PATH}:StateModuleJoining")
    registry = Registry.read(journal.database)
    assert set(registry.models) == models
    assert journal.container.get(Schema).applied_numbers() == migrations
    assert 'acme.state' in [state.name for state in registry.agent_states]
