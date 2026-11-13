import json
from collections.abc import Sequence
from dataclasses import replace
from pathlib import Path

import pytest

from engine.checkout.project_checkouts import ProjectCheckouts
from engine.dotted_path.dotted_path import DottedPath
from engine.errors.refusal import Refusal
from engine.journal.journal_home import JournalHome
from engine.provider.managed_hook import ManagedHook
from engine.provider.program_settings import ProgramSettings
from engine.provider.settings_file import SettingsFile
from engine.provider.program_settings_sync import ProgramSettingsSync
from engine.registry.provider_entry import ProviderEntry
from tests.unit.engine.samples.program_sample import SampleProgram
from tests.unit.engine.samples.sample_container import empty_registry, sample_container


class SettingsProgram(SampleProgram):
    """A sample program whose journal settings file names the hook runner and the folders it was given."""

    def journal_settings(self, home: JournalHome, runner: str, managed: Sequence[ManagedHook], folders: Sequence[Path]) -> ProgramSettings:
        text = json.dumps({"runner": runner, "folders": [str(folder) for folder in folders]}) + "\n"
        return ProgramSettings(self.name, tuple([SettingsFile(home.program_settings_file(self.name), text)]), person_files=tuple([person_file(home, self.name)]))


class SecondProgram(SettingsProgram):
    """A second sample program, so a sync of every program writes two."""

    name = "second"
    title = "Second program"


class SampleCheckouts(ProjectCheckouts):
    """Two separate checkouts a suite would keep beside the project."""

    def __init__(self, folders: tuple[Path, ...]) -> None:
        self.kept = folders

    def folders(self) -> tuple[Path, ...]:
        return self.kept


def person_file(home: JournalHome, program: str) -> Path:
    return home.project_folder / "person" / f"{program}.json"


@pytest.fixture
def home(tmp_path: Path) -> JournalHome:
    return JournalHome(tmp_path / "project" / ".journal")


@pytest.fixture
def sync(home: JournalHome) -> ProgramSettingsSync:
    entries = (ProviderEntry("sample", DottedPath.class_path(SettingsProgram), "sample.program", "Sample program"),
               ProviderEntry("second", DottedPath.class_path(SecondProgram), "second.program", "Second program"))
    registry = replace(empty_registry(), providers=entries)
    home.folder.mkdir(parents=True)
    container = sample_container(home.folder, registry)
    container.bind(ProjectCheckouts, SampleCheckouts(checkouts(home)))
    return container.get(ProgramSettingsSync)


def checkouts(home: JournalHome) -> tuple[Path, ...]:
    return (home.project_folder / "copies" / "copy-1", home.project_folder / "copies" / "copy-2")


def stored_settings(home: JournalHome, program: str) -> dict[str, object]:
    return json.loads(home.program_settings_file(program).read_text())


def test_the_person_files_are_backed_up_before_writing(sync, home):
    person_file(home, "sample").parent.mkdir(parents=True)
    person_file(home, "sample").write_text('{"env": {}}\n')
    assert sync.prepare("sample") == (home.program_settings_file("sample"),)
    assert [copy.read_text() for copy in (home.program_settings_backups / "sample").glob("2*")] == ['{"env": {}}\n']
    person_file(home, "sample").write_text('{"env": {"A": "1"}}\n')
    assert sync.write("sample") == ()
    assert len(list((home.program_settings_backups / "sample").glob("2*"))) == 1


def test_a_write_failure_is_refused_naming_the_program(sync, home):
    home.programs_folder.write_text("a file where the folder belongs")
    with pytest.raises(Refusal, match=r"^the journal could not write its Sample program settings: .+; nothing was started$") as refusal:
        sync.prepare("sample")
    assert refusal.value.suggestion == "free disk space or make .journal/programs writable, then launch again"


def test_the_project_and_its_separate_checkouts_are_passed_to_the_provider(sync, home):
    sync.prepare("sample")
    assert stored_settings(home, "sample") == {"runner": f'"{home.hook_runner}"', "folders": [str(home.project_folder), *(str(folder) for folder in checkouts(home))]}


def test_prepare_all_writes_both_programs(sync, home):
    assert sync.prepare_all() == (home.program_settings_file("sample"), home.program_settings_file("second"))
    assert sync.write_all() == ()
