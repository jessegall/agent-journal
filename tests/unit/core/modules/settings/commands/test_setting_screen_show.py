from argparse import Namespace

from core.modules.settings.commands.setting_screen_show.setting_screen_show_subcommand import SettingScreenShowSubcommand
from core.modules.settings.support.setting_screen import ScreenReading


class RecordingScreens:
    def __init__(self) -> None:
        self.asked: list[str] = []

    def read(self, screen: str) -> ScreenReading:
        self.asked.append(screen)
        return ScreenReading(screen, "abc", ())


def test_a_screen_is_read_by_its_name():
    screens = RecordingScreens()
    reading = SettingScreenShowSubcommand(screens).read(Namespace(screen="work", type=""), None)
    assert (screens.asked, reading.screen) == (["work"], "work")


def test_a_helper_type_names_the_screen_after_a_dot():
    screens = RecordingScreens()
    SettingScreenShowSubcommand(screens).read(Namespace(screen="helper", type="workers"), None)
    assert screens.asked == ["helper.workers"]
