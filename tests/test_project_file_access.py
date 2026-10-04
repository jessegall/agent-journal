import pytest

from commands.dispatch import Request
from commands.http import get_file_diff, get_file_text, get_project_files
from engine.project_files import read_source, walk
from resources.base import Refused


def test_project_reader_rejects_secrets_hidden_paths_and_other_repositories(tmp_path):
    project = tmp_path / "project"
    project.mkdir()
    (project / "visible.txt").write_text("visible")
    (project / ".env").write_text("secret")
    hidden = project / ".private"
    hidden.mkdir()
    (hidden / "note.txt").write_text("private")
    other = tmp_path / "other"
    other.mkdir()
    (other / ".git").mkdir()
    (other / "note.txt").write_text("other")
    (project / "linked.txt").symlink_to(other / "note.txt")

    assert read_source(project, "visible.txt").text == "visible"
    for asked in (".env", ".private/note.txt", str(other / "note.txt"), "linked.txt"):
        with pytest.raises(Refused):
            read_source(project, asked)
    paths, _ = walk(project)
    assert [path.name for path in paths] == ["visible.txt"]


def test_viewer_file_routes_share_the_project_boundary(tmp_path):
    project = tmp_path / "project"
    project.mkdir()
    root = project / ".journal"
    root.mkdir()
    (project / ".env").write_text("secret")
    other = tmp_path / "other"
    other.mkdir()
    (other / ".git").mkdir()
    (other / "note.txt").write_text("outside")
    for handler, query in ((get_file_text, {"path": ".env"}), (get_file_diff, {"path": ".env"}), (get_project_files, {"folder": ".journal"})):
        with pytest.raises(Refused):
            handler(Request(root, {"env": "main"}, query, {}))
    with pytest.raises(Refused):
        get_file_text(Request(root, {"env": "main"}, {"path": str(other / "note.txt")}, {}))
