from collections.abc import Iterable, Sequence
from pathlib import Path

from engine.errors.refusal import Refusal
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.project_manifest import ProjectManifest
from suites.coding.modules.workers.support.project_manifests import ProjectManifests
from suites.coding.modules.workers.support.worker_test_command_entry import WorkerTestCommandEntry
from suites.coding.modules.workers.support.worker_settings import PRESET_TEST_COMMANDS


class WorkerTestPresets:
    """The test commands each dispatched worker gets without a grant: those found in the project's manifests, with a
    person's preset of the same name in its place, and the commands a dispatch names over both."""

    def __init__(self, manifests: ProjectManifests, settings: SettingValues) -> None:
        self.manifests, self.settings = manifests, settings

    def presets(self, folder: str) -> tuple[WorkerTestCommandEntry, ...]:
        return self.presets_of(self.manifests.found(Path(folder)))

    def presets_of(self, manifests: Sequence[ProjectManifest]) -> tuple[WorkerTestCommandEntry, ...]:
        entries = {manifest.test_command.name: manifest.test_command for manifest in manifests if manifest.test_command is not None}
        for value in self.settings.texts(PRESET_TEST_COMMANDS):
            try:
                entry = WorkerTestCommandEntry.parsed_value(value)
            except Refusal:
                continue
            entries[entry.name] = entry
        return self.distinct(entries.values())

    def with_matching(self, folder: str, matching: tuple[WorkerTestCommandEntry, ...]) -> tuple[WorkerTestCommandEntry, ...]:
        names = {entry.name for entry in matching}
        return self.distinct((*matching, *(entry for entry in self.presets(folder) if entry.name not in names)))

    @staticmethod
    def distinct(entries: Iterable[WorkerTestCommandEntry]) -> tuple[WorkerTestCommandEntry, ...]:
        viewed: set[str] = set()
        kept: list[WorkerTestCommandEntry] = []
        for entry in entries:
            if entry.command in viewed:
                continue
            viewed.add(entry.command)
            kept.append(entry)
        return tuple(kept)
