from core.testing.template_cache import python_source_folders
from types import SimpleNamespace

import pytest

from core.testing import pytest_plugin
from core.testing.pytest_plugin import GATE_LOCK_VARIABLE, TEMPLATE_FOLDER_VARIABLE, chooses_template_folder, run_template_folder
from core.testing.run_size import RunSize
from core.testing.template_cache import TemplateCache


def run_config(*args, **options):
    return SimpleNamespace(args=list(args), getoption=lambda name, default=None: options.get(name, default))


@pytest.fixture
def first_process(monkeypatch):
    monkeypatch.delenv(TEMPLATE_FOLDER_VARIABLE, raising=False)
    return monkeypatch


def test_a_story_run_chooses_its_template_folder(first_process):
    assert chooses_template_folder(run_config("tests/stories/core/one.py::test_one"))


@pytest.mark.parametrize("target", ["tests/stories/core/one.py::test_one", "tests"])
def test_no_run_builds_a_template_before_it_starts(first_process, target):
    def refuse_build(*_):
        pytest.fail("a template was built before the run started")

    first_process.setenv(GATE_LOCK_VARIABLE, "1")
    first_process.setattr(pytest_plugin, "run_template_folder", lambda: None)
    first_process.setattr(pytest_plugin, "TemplateDatabases", refuse_build)
    pytest_plugin.pytest_cmdline_main(run_config(target))


def test_whole_suite_run_chooses_its_template_folder(first_process):
    assert chooses_template_folder(run_config())


def test_unit_run_skips_templates(first_process):
    assert not RunSize(["tests/unit/core/one.py"], 1).reaches_stories()
    assert not chooses_template_folder(run_config("tests/unit/core/one.py"))


@pytest.mark.parametrize("option", ["collectonly", "help", "version"])
def test_listing_skips_templates(first_process, option):
    assert not chooses_template_folder(run_config("tests/stories", **{option: True}))


def test_runner_process_skips_templates(first_process):
    config = run_config("tests/stories")
    config.workerinput = {}
    assert not chooses_template_folder(config)


def test_nested_run_skips_templates(first_process):
    first_process.setenv(TEMPLATE_FOLDER_VARIABLE, "/already/chosen")
    assert not chooses_template_folder(run_config("tests/stories"))


def test_folder_choice_ignores_code_change(first_process, tmp_path):
    first_process.setattr(TemplateCache, "folder", lambda cache: tmp_path / "first")
    assert run_template_folder() == tmp_path / "first"
    first_process.setattr(TemplateCache, "folder", lambda cache: tmp_path / "second")
    assert run_template_folder() == tmp_path / "first"


def test_the_viewer_is_no_part_of_a_template_key_or_of_the_pinned_code():
    assert "viewer" not in [folder.name for folder in python_source_folders()]
