from engine.database.database import Database
from engine.registry.registry import Registry
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.support.story_checks import expect_absent_value


def test_a_window_named_as_a_dock_declares_every_read_the_docked_card_asks_for(new_story):
    story = new_story(fixture=BuilderStarted)
    registry = Registry.read(story.container.get(Database))
    windows = {window.name: set(window.reads) for window in registry.windows}
    missing = {f"{dock.type}: {read}" for dock in registry.docks if dock.type in windows for read in dock.reads if read not in windows[dock.type]}
    expect_absent_value(missing)
