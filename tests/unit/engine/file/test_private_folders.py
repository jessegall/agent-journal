import stat

from engine.file.private_folders import PrivateFolders


def test_restricting_a_folder_makes_it_and_the_files_that_exist_readable_by_their_owner_alone(tmp_path):
    folder = tmp_path / "home"
    folder.mkdir(mode=0o755)
    present = folder / "journal.db"
    present.write_text("rows")
    present.chmod(0o644)
    PrivateFolders.restricted(folder, [present, folder / "missing.db"])
    assert stat.S_IMODE(folder.stat().st_mode) == 0o700
    assert stat.S_IMODE(present.stat().st_mode) == 0o600
    assert not (folder / "missing.db").exists()
