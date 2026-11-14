import re

from engine.registry.registry import Registry
from tests.stories.engine.viewer.support.button_icon_modules import PATH
from tests.stories.support.story_checks import expect_value

KIT_FOLDER = "src/viewer/src/kit"
NEW_ICONS = ["pause", "resume", "start", "restore", "lock"]


def rendered_names() -> set[str]:
    icon_source = open(f"{KIT_FOLDER}/Icon.vue").read()
    mark_source = open(f"{KIT_FOLDER}/markIcons.js").read()
    keys = re.findall(r"^\s{4}['\"]?([\w-]+)['\"]?:", icon_source + mark_source, re.MULTILINE)
    return set(keys)


def test_confirm_and_danger_are_kept_in_the_buttons_listing(journal):
    journal.expect_sync_success(f"{PATH}:ConfirmingModule")
    entries = [entry for entry in Registry.read(journal.database).buttons if entry.declaration.name == "iconic.lock"]
    expect_value([(entry.listed()["confirm"], entry.listed()["danger"]) for entry in entries], [("Lock this task?", True)])
