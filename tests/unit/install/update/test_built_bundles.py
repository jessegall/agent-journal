from pathlib import Path

import pytest

from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from install.update.built_bundles import BuiltBundles
from install.working_tree_install import WorkingTreeInstall


def source_tree(root: Path) -> Path:
    source = root / "src"
    files = {
        "viewer/src/main.js": "main",
        "viewer/kit/build.js": "build",
        "viewer/index.html": "<html>",
        "viewer/vite.config.js": "config",
        "core/modules/demo/web/vite.config.js": "window config",
        "core/modules/demo/web/src/demo.js": "demo",
    }
    for name, text in files.items():
        (source / name).parent.mkdir(parents=True, exist_ok=True)
        (source / name).write_text(text)
    for folder in ("core/modules/viewer/web/dist", "core/modules/demo/web/dist"):
        (source / folder).mkdir(parents=True, exist_ok=True)
    return source


@pytest.fixture
def built(tmp_path):
    source = source_tree(tmp_path)
    BuiltBundles(source).stamp_all()
    return source


def test_bundles_stamped_after_their_build_are_current(built):
    assert BuiltBundles(built).stale() == []


def test_a_bundle_never_stamped_is_behind(tmp_path):
    assert len(BuiltBundles(source_tree(tmp_path)).stale()) == 2


def test_a_changed_window_source_leaves_only_its_bundle_behind(built):
    (built / "core/modules/demo/web/src/demo.js").write_text("demo changed")

    assert [bundle.dist for bundle in BuiltBundles(built).stale()] == [built / "core/modules/demo/web/dist"]


def test_a_changed_viewer_source_leaves_the_shell_behind(built):
    (built / "viewer/src/main.js").write_text("main changed")

    assert [bundle.dist for bundle in BuiltBundles(built).stale()] == [built / "core/modules/viewer/web/dist"]


def test_an_install_of_a_tree_with_a_stale_bundle_is_refused_and_names_the_build(built, tmp_path):
    (built / "viewer/src/main.js").write_text("main changed")
    home = JournalHome(tmp_path / ".journal")
    home.folder.mkdir(parents=True)

    with pytest.raises(Refusal) as refusal:
        WorkingTreeInstall(home).run(built)

    assert "core/modules/viewer/web/dist" in refusal.value.text
    assert not (home.folder / "versions").exists()
