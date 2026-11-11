from collections.abc import Iterable
from pathlib import Path

from engine.errors.refusal import Refusal
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.project_manifests import ProjectManifests
from suites.coding.modules.workers.support.worker_test_command_entry import WorkerTestCommandEntry
from suites.coding.modules.workers.support.worker_settings import PRESET_TEST_COMMANDS


class WorkerTestPresets:
    """The test commands each dispatched worker gets without a grant: those found in the project's manifests, with a
    person's preset of the same name in its place, and the commands a dispatch names over both."""

    def __init__(self, manifests: ProjectManifests, settings: SettingValues) -> None:
        self.manifests, self.settings = manifests, settings

    def presets(self, folder: str) -> tuple[WorkerTestCommandEntry, ...]:
        entries = {entry.name: entry for entry in self.manifests.test_commands(Path(folder))}
        for value in self.settings.texts(PRESET_TEST_COMMANDS):
            try:
                entry = WorkerTestCommandEntry.parsed_value(value)
            except Refusal:
                continue
            entries[entry.name] = entry
        return self.distinct(entries.values())

    def with_named(self, folder: str, named: tuple[WorkerTestCommandEntry, ...]) -> tuple[WorkerTestCommandEntry, ...]:
        names = {entry.name for entry in named}
        return self.distinct((*named, *(entry for entry in self.presets(folder) if entry.name not in names)))

    @staticmethod
    def distinct(entries: Iterable[WorkerTestCommandEntry]) -> tuple[WorkerTestCommandEntry, ...]:
        seen: set[str] = set()
        kept: list[WorkerTestCommandEntry] = []
        for entry in entries:
            if entry.command not in seen:
                seen.add(entry.command)
                kept.append(entry)
        return tuple(kept)
