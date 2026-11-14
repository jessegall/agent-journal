from pathlib import Path
import shutil

from core.modules.profiles.support.profile_files import PROFILE_FOLDER, ProfileFiles
from suites.coding.support.shipped_profiles import WORKER_MEDIOR_PROFILE
from suites.coding.support.shipped_profiles import WORKER_PROFILE
from suites.coding.support.shipped_profiles import WORKER_SENIOR_PROFILE

PROJECT_FOLDER = Path(__file__).resolve().parents[4]
POINTER = "read ARCHITECTURE.md"


def test_the_project_tells_each_worker_profile_to_read_the_architecture_and_the_file_is_in_the_checkout(journal):
    folder = journal.home.project_folder / PROFILE_FOLDER
    folder.mkdir(parents=True)
    for name in (f"{WORKER_PROFILE.name}", f"{WORKER_MEDIOR_PROFILE.name}", f"{WORKER_SENIOR_PROFILE.name}"):
        shutil.copy(PROJECT_FOLDER / PROFILE_FOLDER / f"{name}.md", folder)
    profiles = journal.container.get(ProfileFiles)
    effective = [profiles.effective(name) for name in (f"{WORKER_PROFILE.name}", f"{WORKER_MEDIOR_PROFILE.name}", f"{WORKER_SENIOR_PROFILE.name}")]
    assert all((POINTER in profile.body for profile in effective))
    assert not any((profile.module_text_changed for profile in effective))
    assert (PROJECT_FOLDER / 'ARCHITECTURE.md').is_file()
