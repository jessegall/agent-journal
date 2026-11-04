import io

import pytest

from core.base.caller.caller_request import CallerRequest
from core.base.cli.line_run import LineRun
from core.base.database.database import Database
from core.base.registry.registry import Registry
from tests.stories.core.base.module.folder_modules import source_folder
from tests.stories.core.support.fixtures import UserJoined


@pytest.fixture
def installed_notes(new_story, source_folder):
    story = new_story(fixture=UserJoined)
    stream = io.StringIO()
    code = LineRun(story.home).run(["module", "add", str(source_folder)], CallerRequest({}, "/", 0), stream)
    story.expect_rows(code == 0)
    code, text = story.synced()
    story.expect_rows(code == 0)
    story.run_listeners()
    story.expect_success("window allow button:folder.notes --type runs --environment main", actor=story.user)
    return story


def execute_removal(story, variables):
    stream = io.StringIO()
    code = LineRun(story.home).run(["module", "remove", "folder.notes"], CallerRequest(variables, "/", 0), stream)
    return code, stream.getvalue()


def test_a_person_removes_the_folder_buttons_templates_and_allowances(installed_notes, source_folder):
    code, text = execute_removal(installed_notes, {"USER": "Ada"})
    installed_notes.expect_rows(code == 0, "removed module folder.notes" in text,
                               not (installed_notes.home.modules_folder / source_folder.name).exists())
    registry = Registry.read(installed_notes.container.get(Database))
    installed_notes.expect_rows(all(button.module != "folder.notes" for button in registry.buttons),
                               all(template.module != "folder.notes" for template in registry.templates))
    code, text = installed_notes.synced()
    installed_notes.expect_rows(code == 0)
    installed_notes.expect_no_text("template list", "Folder review")
    installed_notes.expect_no_text("window-permission list", "button:folder.notes")
    stream = io.StringIO()
    code = LineRun(installed_notes.home).run(["module", "add", str(source_folder)], CallerRequest({"USER": "Ada"}, "/", 0), stream)
    installed_notes.expect_rows(code == 0, (installed_notes.home.modules_folder / source_folder.name).is_dir())


def test_a_dependency_refusal_keeps_the_module_and_its_folder(installed_notes, source_folder):
    installed_notes.expect_sync_success("tests.stories.core.base.module.support.notes_dependent:NotesDependent")
    listed = installed_notes.home.module_list.read_text()
    code, text = execute_removal(installed_notes, {"USER": "Ada"})
    installed_notes.expect_rows(code == 1, "depends on folder.notes" in text,
                               installed_notes.home.module_list.read_text() == listed,
                               (installed_notes.home.modules_folder / source_folder.name).is_dir())


@pytest.mark.parametrize("variables", [{"CLAUDE_CODE_SESSION_ID": "unknown"}, {"USER": "Ada", "JOURNAL_AGENT_SESSION": "s-1"}])
def test_only_a_person_removes_a_module(installed_notes, source_folder, variables):
    code, text = execute_removal(installed_notes, variables)
    installed_notes.expect_rows(code == 1, "only a person removes a module" in text,
                               (installed_notes.home.modules_folder / source_folder.name).is_dir())
