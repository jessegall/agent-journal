import re

from engine.enums.window_icon import WindowIcon
from tests.stories.support.story_checks import expect_value

KIT_FOLDER = "src/viewer/src/kit"
NEW_ICONS = ["pause", "resume", "start", "restore", "lock"]


def rendered_names() -> set[str]:
    icon_source = open(f"{KIT_FOLDER}/Icon.vue").read()
    mark_source = open(f"{KIT_FOLDER}/markIcons.js").read()
    keys = re.findall(r"^\s{4}['\"]?([\w-]+)['\"]?:", icon_source + mark_source, re.MULTILINE)
    return set(keys)


def test_every_window_icon_has_a_drawn_shape():
    missing = sorted(icon.value for icon in WindowIcon if icon.value not in rendered_names())
    expect_value(bool(missing), False)
