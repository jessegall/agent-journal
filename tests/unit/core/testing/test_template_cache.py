import os
import time

from core.testing.template_cache import RUNNING_FOLDER_SECONDS, TemplateCache
import core.testing.template_cache as template_cache


def sample_cache(tmp_path, monkeypatch):
    source = tmp_path / "src" / "core"
    source.mkdir(parents=True)
    sample = tmp_path / "tests" / "stories" / "sample.py"
    sample.parent.mkdir(parents=True)
    sample.write_text("class Sample: pass\n")
    monkeypatch.setattr(template_cache, "CORE_FOLDER", source)
    return TemplateCache(tmp_path / "cache"), sample


def test_sample_module_change_uses_a_new_template_folder(tmp_path, monkeypatch):
    cache, sample = sample_cache(tmp_path, monkeypatch)
    first = cache.folder()
    (first / "template").write_text("old")

    sample.write_text("class Sample: value = 1\n")
    second = cache.folder()

    assert second != first
    assert not (second / "template").exists()


def test_a_code_change_leaves_a_folder_a_running_suite_uses(tmp_path, monkeypatch):
    cache, sample = sample_cache(tmp_path, monkeypatch)
    running = cache.folder()

    sample.write_text("class Sample: value = 1\n")
    cache.folder()

    assert running.is_dir()


def test_a_code_change_removes_a_folder_unused_for_an_hour(tmp_path, monkeypatch):
    cache, sample = sample_cache(tmp_path, monkeypatch)
    unused = cache.folder()
    an_hour_ago = time.time() - RUNNING_FOLDER_SECONDS - 1
    os.utime(unused, (an_hour_ago, an_hour_ago))

    sample.write_text("class Sample: value = 1\n")
    cache.folder()

    assert not unused.exists()
