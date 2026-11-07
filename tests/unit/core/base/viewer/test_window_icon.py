import re
from pathlib import Path

from core.base.viewer.window_icon import WindowIcon

KIT_FOLDER = Path(__file__).resolve().parents[5] / "src" / "viewer" / "src" / "kit"
ICON_FILES = (KIT_FOLDER / "markIcons.js", KIT_FOLDER / "Icon.vue")


def test_every_window_icon_is_in_the_shells_icon_set():
    names = [name for path in ICON_FILES for name in re.findall(r"^    ([a-z_]+):", path.read_text(), re.MULTILINE)]
    assert {icon.value for icon in WindowIcon} - set(names) == set()
