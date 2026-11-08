from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.base.viewer.panel_labels import PanelLabels
from core.base.viewer.window_icon import WindowIcon
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value


def dock_actions(story) -> list[tuple[str, str, str]]:
    registry = Registry.read(story.container.get(Database))
    on_marks = [(mark.module, button["icon"], button["label"]) for mark in registry.marks for button in (*mark.buttons, *mark.group_buttons)]
    on_docks = [(dock.module, button["icon"], button["label"]) for dock in registry.docks for button in dock.buttons]
    on_slots = [(button.module, button.declaration.icon, button.declaration.label) for button in registry.buttons if any(slot.startswith("dock.") for slot in button.declaration.slots)]
    return [*on_marks, *on_docks, *on_slots]


def test_every_dock_button_has_an_icon_in_the_set_and_a_short_plain_label(new_story):
    actions = dock_actions(new_story(fixture=MainEnvironment))
    expect_value(bool(actions), True)
    icons = {icon.value for icon in WindowIcon}
    expect_value([action for action in actions if action[1] not in icons], [])
    expect_value([action for action in actions if len(action[2].split()) > 2 or "please" in action[2].lower()], [])


def test_no_dock_button_starts_with_a_panel_word(new_story):
    actions = dock_actions(new_story(fixture=MainEnvironment))
    expect_value([action for action in actions if PanelLabels.begins(action[2])], [])
