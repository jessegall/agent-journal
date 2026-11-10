import io
import json
import shutil
from pathlib import Path
from uuid import uuid4

import pytest

from engine.caller.caller_request import CallerRequest
from engine.cli.line_run import LineRun
from engine.database.database import Database
from engine.registry.registry import Registry
from core.testing.expect_row import expect_row
from tests.stories.core.support.fixtures import MainEnvironment

SAMPLE = Path(__file__).parent / "support" / "folder_sample"


@pytest.fixture
def source_folder(tmp_path):
    folder = tmp_path / f"notes_{uuid4().hex}"
    shutil.copytree(SAMPLE, folder)
    return folder


def test_a_module_is_copied_listed_and_synced_from_an_external_folder(new_story, source_folder):
    story = new_story(fixture=MainEnvironment)
    stream = io.StringIO()
    code = LineRun(story.home).run(["module", "add", str(source_folder)], CallerRequest({}, str(source_folder.parent), 0), stream)
    story.expect_rows(code == 0, (story.home.folder / "modules" / source_folder.name / "module.py").is_file())
    paths = json.loads(story.home.module_list.read_text())
    story.expect_rows(f"{source_folder.name}.module:FolderNotesModule" in paths)
    registry = Registry.read(story.container.get(Database))
    entry = next(template for template in registry.templates if template.module == "folder.notes")
    expect_row(entry.declaration, title="Folder review")


def test_an_entry_that_does_not_import_is_refused_by_module_sync(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal("not_installed_module.module:MissingModule", "not_installed_module.module:MissingModule")


def test_a_folder_that_does_not_declare_a_module_leaves_no_installation(new_story, source_folder):
    story = new_story(fixture=MainEnvironment)
    (source_folder / "module.py").write_text("VALUE = 1\n")
    saved_list = story.home.module_list.read_text()
    stream = io.StringIO()
    code = LineRun(story.home).run(["module", "add", str(source_folder)], CallerRequest({}, str(source_folder.parent), 0), stream)
    story.expect_rows(code == 1, "module" in stream.getvalue(), story.home.module_list.read_text() == saved_list,
                      not (story.home.folder / "modules" / source_folder.name).exists())


def test_a_refused_folder_can_be_fixed_and_added_again(new_story, source_folder):
    story = new_story(fixture=MainEnvironment)
    module_file = source_folder / "module.py"
    original_code = module_file.read_text()
    module_file.write_text("VALUE = 1\n")
    runner = LineRun(story.home)
    request = CallerRequest({}, str(source_folder.parent), 0)
    stream = io.StringIO()
    story.expect_rows(runner.run(["module", "add", str(source_folder)], request, stream) == 1)
    module_file.write_text(original_code)
    story.expect_rows(runner.run(["module", "add", str(source_folder)], request, stream) == 0)


def test_a_folder_cannot_replace_an_imported_python_package(new_story, source_folder):
    story = new_story(fixture=MainEnvironment)
    source = source_folder.with_name("core")
    source_folder.rename(source)
    saved_list = story.home.module_list.read_text()
    stream = io.StringIO()
    code = LineRun(story.home).run(["module", "add", str(source)], CallerRequest({}, str(source.parent), 0), stream)
    story.expect_rows(code == 1, "already imported" in stream.getvalue(), story.home.module_list.read_text() == saved_list)
