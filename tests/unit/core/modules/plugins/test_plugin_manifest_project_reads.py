import json

from core.modules.plugins.support.plugin_manifest import PluginManifest


def manifest_with(tmp_path, project_reads: object) -> PluginManifest:
    folder = tmp_path / "plugin"
    folder.mkdir()
    (folder / "journal-plugin.json").write_text(json.dumps({"name": "reads", "title": "Reads", "version": "1", "project_reads": project_reads}))
    return PluginManifest.read(folder)


def project(tmp_path):
    root = tmp_path / "project"
    (root / ".rules").mkdir(parents=True)
    (tmp_path / "outside").mkdir()
    (root / "link-out").symlink_to(tmp_path / "outside", target_is_directory=True)
    (root / "link-in").symlink_to(root / ".rules", target_is_directory=True)
    return root.resolve()


def test_a_folder_inside_the_project_opens_at_its_real_path(tmp_path):
    root = project(tmp_path)
    assert manifest_with(tmp_path, [".rules", "link-in"]).project_folders(root) == (root / ".rules", root / ".rules")


def test_a_wrong_entry_never_opens(tmp_path):
    root = project(tmp_path)
    wrong = ["", ".", "./", "..", "../outside", ".rules/../..", "/etc", str(root / ".rules"), "link-out"]
    assert manifest_with(tmp_path, wrong).project_folders(root) == ()


def test_a_project_reads_that_is_no_list_declares_nothing(tmp_path):
    assert manifest_with(tmp_path, ".rules").project_reads == ()


def test_each_declared_folder_is_a_row_of_what_it_runs(tmp_path):
    rows = manifest_with(tmp_path, [".rules"]).run_rows()
    assert [row["command"] for row in rows if row["category"] == "reads"] == [".rules"]
