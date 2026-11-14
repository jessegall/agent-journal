from engine.module.source_hash import SourceHash


def test_folder_order_does_not_change_the_hash(tmp_path):
    core, extra = tmp_path / "core", tmp_path / "extra"
    core.mkdir()
    extra.mkdir()
    (core / "sample.py").write_text("value = 1\n")
    (extra / "sample.py").write_text("value = 2\n")
    assert SourceHash.text((core, extra)) == SourceHash.text((extra, core))
