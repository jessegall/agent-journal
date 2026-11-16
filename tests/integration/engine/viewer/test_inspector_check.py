from engine.registry.registry import Registry
from tests.stories.engine.viewer.support.inspector_faults import PATH
from tests.stories.support.story_checks import expect_value


def test_inspector_actions_become_buttons_on_the_row_slot(journal):
    journal.expect_sync_success(f"{PATH}:ValidModule")
    buttons = {entry.declaration.name: entry.declaration for entry in Registry.read(journal.database).buttons}
    expect_value(tuple(buttons["shown.start"].slots), ("row.reminder",))
