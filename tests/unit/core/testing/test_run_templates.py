from types import SimpleNamespace

import pytest

from core.testing.pytest_plugin import TEMPLATE_FOLDER_VARIABLE, is_template_build_due, run_template_folder
from core.testing.run_size import RunSize
from core.testing.template_cache import TemplateCache


def run_config(*args, **options):
    return SimpleNamespace(args=list(args), getoption=lambda name, default=None: options.get(name, default))


@pytest.fixture
def first_process(monkeypatch):
    monkeypatch.delenv(TEMPLATE_FOLDER_VARIABLE, raising=False)
    return monkeypatch


def test_single_story_run_builds_templates(first_process):
    assert is_template_build_due(run_config("tests/stories/core/one.py::test_one"))


def test_whole_suite_run_builds_templates(first_process):
    assert is_template_build_due(run_config())


def test_unit_run_skips_templates(first_process):
    assert not RunSize(["tests/unit/core/one.py"], 1).reaches_stories()
    assert not is_template_build_due(run_config("tests/unit/core/one.py"))


@pytest.mark.parametrize("option", ["collectonly", "help", "version"])
def test_listing_skips_templates(first_process, option):
    assert not is_template_build_due(run_config("tests/stories", **{option: True}))


def test_runner_process_skips_templates(first_process):
    config = run_config("tests/stories")
    config.workerinput = {}
    assert not is_template_build_due(config)


def test_nested_run_skips_templates(first_process):
    first_process.setenv(TEMPLATE_FOLDER_VARIABLE, "/already/chosen")
    assert not is_template_build_due(run_config("tests/stories"))


def test_folder_choice_ignores_code_change(first_process, tmp_path):
    first_process.setattr(TemplateCache, "folder", lambda cache: tmp_path / "first")
    assert run_template_folder() == tmp_path / "first"
    first_process.setattr(TemplateCache, "folder", lambda cache: tmp_path / "second")
    assert run_template_folder() == tmp_path / "first"
