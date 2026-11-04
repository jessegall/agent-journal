import re
from pathlib import Path

from core.base.viewer.window_icon import WindowIcon

ICON_FILE = Path(__file__).resolve().parents[5] / "src" / "viewer" / "src" / "kit" / "markIcons.js"


def test_every_window_icon_is_in_the_shells_icon_set():
    names = re.findall(r"^    ([a-z_]+):", ICON_FILE.read_text(), re.MULTILINE)
    assert {icon.value for icon in WindowIcon} - set(names) == set()
