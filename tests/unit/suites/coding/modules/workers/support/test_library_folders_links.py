from suites.coding.modules.workers.support.library_folders import LibraryFolders


def test_a_linked_library_is_dropped_as_a_link_and_linked_again(tmp_path):
    source, worktree = tmp_path / "project", tmp_path / "worktree"
    (source / "node_modules").mkdir(parents=True)
    (source / "node_modules" / "package.json").write_text("{}")
    worktree.mkdir()
    (worktree / "node_modules").symlink_to(source / "node_modules", target_is_directory=True)
    folders = LibraryFolders(None, None)
    folders.drop(str(worktree), ["node_modules"], [])
    assert not (worktree / "node_modules").exists() and (source / "node_modules" / "package.json").exists()
    folders.restore(str(source), str(worktree), ["node_modules"], [])
    assert (worktree / "node_modules").is_symlink() and (worktree / "node_modules" / "package.json").exists()
