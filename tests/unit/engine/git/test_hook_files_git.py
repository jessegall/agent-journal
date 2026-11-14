import subprocess
from pathlib import Path

from engine.git.hook_files_git import HookFilesGit


def test_tracks_distinguishes_tracked_and_untracked_files(tmp_path: Path):
    subprocess.run(["git", "init", str(tmp_path)], check=True, capture_output=True, timeout=10)
    tracked_file = tmp_path / "tracked file.json"
    tracked_file.write_text("{}")
    (tmp_path / "untracked.json").write_text("{}")
    subprocess.run(["git", "-C", str(tmp_path), "add", "--", tracked_file.name], check=True, capture_output=True, timeout=10)
    git = HookFilesGit(tmp_path)
    assert git.tracks(tracked_file.name)
    assert not git.tracks("untracked.json")
    assert not git.tracks("missing.json")
