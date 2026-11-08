from collections.abc import Generator
from contextlib import contextmanager

from core.base.module.performance_tools import PerformanceTools
from core.modules.processes.ticks.output_reading import OutputReading
from core.modules.settings.bindings.support.setting_values import SettingValues


class KeptSettings:
    def __init__(self) -> None:
        self.is_kept = False

    @contextmanager
    def keep_rows(self) -> Generator[None]:
        self.is_kept = True
        yield
        self.is_kept = False


class NoCostTools:
    def begin(self) -> None:
        return None

    def cost(self, started: None) -> None:
        return None


class FixedContainer:
    def __init__(self, settings: KeptSettings) -> None:
        self.parts = {SettingValues: settings, PerformanceTools: NoCostTools()}

    def get(self, part: type) -> object:
        return self.parts[part]


class RecordingReading(OutputReading):
    def __init__(self, settings: KeptSettings) -> None:
        super().__init__()
        self.settings = settings
        self.kept_while_reading = False

    def read(self, container: FixedContainer) -> bool:
        self.kept_while_reading = self.settings.is_kept
        return True


def test_a_tick_reads_its_outputs_with_the_setting_rows_kept():
    settings = KeptSettings()
    reading = RecordingReading(settings)

    assert reading(FixedContainer(settings)) is True

    assert reading.kept_while_reading is True
    assert settings.is_kept is False
