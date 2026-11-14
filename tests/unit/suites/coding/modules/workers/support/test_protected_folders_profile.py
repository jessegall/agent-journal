from types import SimpleNamespace

from suites.coding.modules.workers.support.protected_folders import ProtectedFolders


def folders(project: list[str], by_profile: dict[str, tuple[str, ...]]) -> ProtectedFolders:
    settings = SimpleNamespace(project=SimpleNamespace(texts=lambda key: project))
    profiles = SimpleNamespace(effective=lambda name: SimpleNamespace(protected_folders=by_profile.get(name, ())))
    return ProtectedFolders(settings, profiles)


def test_a_profile_adds_its_own_protected_folders_to_the_projects(tmp_path):
    protected = folders(["cart.py"], {"journal-worker-medior": ("src/engine",)})
    assert protected.match(str(tmp_path), "src/engine/driver/walk.py", "journal-worker-medior") == "src/engine"
    assert protected.match(str(tmp_path), "cart.py", "journal-worker-medior") == "cart.py"


def test_another_profile_does_not_get_them(tmp_path):
    protected = folders([], {"journal-worker-medior": ("src/engine",)})
    assert protected.match(str(tmp_path), "src/engine/driver/walk.py", "journal-worker-senior") == ""
