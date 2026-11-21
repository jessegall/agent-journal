from engine.file.file_access import FileAccess
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


def test_a_worktree_folder_that_cannot_be_deleted_whole_is_moved_out_of_its_place(tmp_path, monkeypatch):
    folder = tmp_path / "worker-275"
    FileAccess.mkdir(folder / "vendor" / "laravel" / "passkeys", parents=True)
    rmtree = FileAccess.rmtree
    calls = []

    def first_fails(path, ignore_errors=False):
        calls.append(path)
        if len(calls) == 1:
            raise OSError(66, "Directory not empty")
        rmtree(path, ignore_errors=ignore_errors)

    monkeypatch.setattr(FileAccess, "rmtree", staticmethod(first_fails))
    WorktreeGit.delete_folder(folder)
    assert not FileAccess.exists(folder)
