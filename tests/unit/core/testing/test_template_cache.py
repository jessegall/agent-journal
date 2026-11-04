from core.testing.template_cache import TemplateCache
import core.testing.template_cache as template_cache


def test_sample_module_change_uses_a_new_template_folder(tmp_path, monkeypatch):
    source = tmp_path / "src" / "core"
    source.mkdir(parents=True)
    sample = tmp_path / "tests" / "stories" / "sample.py"
    sample.parent.mkdir(parents=True)
    sample.write_text("class Sample: pass\n")
    monkeypatch.setattr(template_cache, "CORE_FOLDER", source)
    cache = TemplateCache(tmp_path / "cache")
    first = cache.folder()
    (first / "template").write_text("old")

    sample.write_text("class Sample: value = 1\n")
    second = cache.folder()

    assert second != first
    assert not (second / "template").exists()
