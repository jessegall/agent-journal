import pytest
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from core.modules.drivers.models.driver_comparison import DriverComparison
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.integration.core.modules.drivers.support.walk_only import walk_only


# the old walk's own machinery, tested with no slice of the new driver live until task 10324 deletes it with the walk
@pytest.fixture
def played(played):
    return lambda *arguments, **fields: walk_only(played(*arguments, **fields))

EDIT = HookSamples.edit("src/cart.py")


def test_with_the_comparison_off_a_hook_saves_no_comparison(played):
    story = played(BuilderStarted)
    story.hook("s-1", EDIT)
    assert story.container.get(Queries).query(DriverComparison).filter(session_agent_id=story.agent.id).first() is None
