import re

from engine.database.database import Database
from engine.registry.registry import Registry
from core.base.viewer.window_icon import WindowIcon
from tests.stories.core.base.viewer.support.button_icon_modules import PATH
from tests.stories.core.support.fixtures import MainEnvironment
from tests.stories.support.story_checks import expect_value

KIT_FOLDER = "src/viewer/src/kit"
NEW_ICONS = ["pause", "resume", "start", "restore", "lock"]


def rendered_names() -> set[str]:
    icon_source = open(f"{KIT_FOLDER}/Icon.vue").read()
    mark_source = open(f"{KIT_FOLDER}/markIcons.js").read()
    keys = re.findall(r"^\s{4}['\"]?([\w-]+)['\"]?:", icon_source + mark_source, re.MULTILINE)
    return set(keys)


def test_the_new_icon_names_are_accepted_for_a_button(new_story):
    expect_value(bool(all(name in {icon.value for icon in WindowIcon} for name in NEW_ICONS)), True)
    new_story(fixture=MainEnvironment).expect_sync_success(f"{PATH}:NewIconModule")


def test_confirm_and_danger_are_kept_in_the_buttons_listing(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:ConfirmingModule")
    entries = [entry for entry in Registry.read(story.container.get(Database)).buttons if entry.declaration.name == "iconic.lock"]
    expect_value([(entry.listed()["confirm"], entry.listed()["danger"]) for entry in entries], [("Lock this task?", True)])


def test_every_window_icon_has_a_drawn_shape():
    missing = sorted(icon.value for icon in WindowIcon if icon.value not in rendered_names())
    expect_value(bool(missing), False)
