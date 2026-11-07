from core.modules.settings.support.setting_reader import SettingReader
from suites.coding.modules.workers.support.worker_settings import DISPATCHES_WORKERS_SETTING, MAIN_MERGES_WORKERS, MERGER_ENABLED
from suites.coding.support.coding_settings import AUTO_MODE_SETTING, DESIGNER_ENABLED_SETTING, KEEP_RUNNING_SETTING, STARTS_HELPERS_SETTING
from suites.coding.support.main_options import MainOptions

CONTROL_KEYS = {"auto": AUTO_MODE_SETTING, "sends_workers": DISPATCHES_WORKERS_SETTING, "keeps_going": KEEP_RUNNING_SETTING, "merger": MERGER_ENABLED,
                "helpers": STARTS_HELPERS_SETTING, "designer": DESIGNER_ENABLED_SETTING, "may_merge": MAIN_MERGES_WORKERS}


class CodingMainOptions:
    """Reads the workflow controls of the main agent once for an environment: each one's value and where it was set."""

    def __init__(self, reader: SettingReader) -> None:
        self.reader = reader

    def options(self) -> MainOptions:
        values: dict[str, bool] = {}
        sources: list[tuple[str, str]] = []
        problems: list[str] = []
        with self.reader.keep_rows():
            for name, key in CONTROL_KEYS.items():
                current = self.reader.current(key)
                sources.append((key, current.source))
                if isinstance(current.value, bool):
                    values[name] = current.value
                else:
                    values[name] = False
                    problems.append(f"{key} holds {current.value!r}, not on or off")
        return MainOptions(**values, sources=tuple(sources), problems=tuple(problems))
