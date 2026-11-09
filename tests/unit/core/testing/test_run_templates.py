from types import SimpleNamespace

import pytest

from core.testing import pytest_plugin
from core.testing.pytest_plugin import TEMPLATE_FOLDER_VARIABLE, is_template_build_due, run_template_folder
from core.testing.run_size import RunSize
from core.testing.template_cache import TemplateCache


def run_config(*args, **options):
    return SimpleNamespace(args=list(args), getoption=lambda name, default=None: options.get(name, default))


@pytest.fixture
def first_process(monkeypatch):
    monkeypatch.delenv(TEMPLATE_FOLDER_VARIABLE, raising=False)
    return monkeypatch


def test_small_story_run_builds_only_the_templates_it_uses(first_process):
    assert not is_template_build_due(run_config("tests/stories/core/one.py::test_one"))


def story_file(folder, name, tests):
    path = folder / "stories" / name
    path.parent.mkdir(exist_ok=True)
    path.write_text("".join(f"def test_{number}():\n    pass\n" for number in range(tests)))
    return str(path)


def test_a_few_story_files_do_not_wait_for_every_template(first_process, tmp_path):
    assert not is_template_build_due(run_config(story_file(tmp_path, "one.py", 10), story_file(tmp_path, "two.py", 10)))


def test_story_files_of_a_large_run_build_templates_first(first_process, tmp_path):
    assert is_template_build_due(run_config(story_file(tmp_path, "one.py", 30), story_file(tmp_path, "two.py", 30)))


def test_a_small_story_run_never_starts_the_prebuild(first_process, monkeypatch):
    def refuse_prebuild(*_):
        pytest.fail("a small story run built every template before it started")

    monkeypatch.setattr(pytest_plugin, "TemplatePrebuild", refuse_prebuild)
    pytest_plugin.pytest_cmdline_main(run_config("tests/stories/core/one.py::test_one"))


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
