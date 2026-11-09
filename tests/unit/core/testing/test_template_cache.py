import os
import time
import shutil
import subprocess
import sys
from pathlib import Path

from core.testing.template_cache import UNUSED_FOLDER_SECONDS, TemplateCache
import core.testing.template_cache as template_cache


def sample_cache(tmp_path, monkeypatch):
    source = tmp_path / "src" / "core"
    source.mkdir(parents=True)
    sample = tmp_path / "tests" / "stories" / "support" / "sample.py"
    sample.parent.mkdir(parents=True)
    sample.write_text("class Sample: pass\n")
    monkeypatch.setattr(template_cache, "CORE_FOLDER", source)
    return TemplateCache(tmp_path / "cache"), sample


def test_sample_module_change_uses_a_new_template_folder(tmp_path, monkeypatch):
    cache, sample = sample_cache(tmp_path, monkeypatch)
    first = cache.folder()
    (first / "template").write_text("old")

    sample.write_text("class Sample: value = 1\n")
    second = process_folder(tmp_path, cache.root)

    assert second != first
    assert not (second / "template").exists()


def test_a_code_change_leaves_a_folder_a_running_suite_uses(tmp_path, monkeypatch):
    cache, sample = sample_cache(tmp_path, monkeypatch)
    running = cache.folder()

    sample.write_text("class Sample: value = 1\n")
    process_folder(tmp_path, cache.root)

    assert running.is_dir()


def test_a_code_change_removes_a_folder_unused_for_a_day(tmp_path, monkeypatch):
    cache, sample = sample_cache(tmp_path, monkeypatch)
    unused = cache.folder()
    for lease in unused.glob(".in-use-*"):
        lease.unlink()
    expired_at = time.time() - UNUSED_FOLDER_SECONDS - 1
    os.utime(unused, (expired_at, expired_at))

    sample.write_text("class Sample: value = 1\n")
    process_folder(tmp_path, cache.root)

    assert not unused.exists()


FOLDER_SCRIPT = """
import sys
from pathlib import Path
import core.testing.template_cache as cache
cache.CORE_FOLDER = Path(sys.argv[1]) / "src" / "core"
print(cache.TemplateCache(Path(sys.argv[2])).folder())
"""


def process_folder(checkout, cache):
    answer = subprocess.run([sys.executable, "-c", FOLDER_SCRIPT, str(checkout), str(cache)], env={**os.environ, "PYTHONPATH": os.pathsep.join(sys.path)}, capture_output=True, text=True, timeout=20)
    assert answer.returncode == 0, answer.stdout + answer.stderr
    return Path(answer.stdout.strip())


def test_every_checkout_with_the_same_sources_shares_a_folder_and_changed_bytes_use_a_new_one(tmp_path, monkeypatch):
    first = tmp_path / "first"
    first.mkdir()
    cache, sample = sample_cache(first, monkeypatch)
    second = tmp_path / "second"
    shutil.copytree(first, second)
    shared = tmp_path / "shared"
    initial = process_folder(first, shared)
    copied = process_folder(second, shared)
    assert initial == copied
    assert process_folder(second, shared) == copied
    changed = second / sample.relative_to(first)
    modified_at = changed.stat().st_mtime_ns
    changed.write_text("class Sample: None\n")
    os.utime(changed, ns=(modified_at, modified_at))
    assert process_folder(second, shared) != copied


def test_source_paths_participate_in_the_content_hash(tmp_path, monkeypatch):
    cache, sample = sample_cache(tmp_path, monkeypatch)
    initial = process_folder(tmp_path, cache.root)
    sample.rename(sample.with_name("renamed.py"))
    assert process_folder(tmp_path, cache.root) != initial


def test_the_sources_are_read_only_once_in_a_process(tmp_path, monkeypatch):
    cache, sample = sample_cache(tmp_path, monkeypatch)
    reads = []
    original = Path.read_bytes

    def read_bytes(path):
        if path == sample:
            reads.append(path)
        return original(path)

    monkeypatch.setattr(Path, "read_bytes", read_bytes)
    initial = cache.folder()
    assert cache.folder() == initial
    sample.write_text("class Sample: changed = True\n")
    assert cache.folder() == initial
    assert reads == [sample]


def test_a_folder_a_running_process_holds_is_never_removed_by_age_or_size(tmp_path):
    cache = TemplateCache(tmp_path / "cache", limit_bytes=1)
    retained = cache.root / "held"
    retained.mkdir(parents=True)
    (retained / "data").write_bytes(b"x" * 500)
    (retained / f".in-use-{os.getpid()}").touch()
    expired_at = time.time() - UNUSED_FOLDER_SECONDS - 1
    os.utime(retained, (expired_at, expired_at))
    cache.drop_expired()
    assert retained.is_dir()


def test_a_lease_of_a_process_that_is_gone_holds_nothing(tmp_path):
    cache = TemplateCache(tmp_path / "cache", limit_bytes=1)
    remaining = cache.root / "left"
    remaining.mkdir(parents=True)
    (remaining / "data").write_bytes(b"x" * 500)
    (remaining / ".in-use-999999").touch()
    expired_at = time.time() - UNUSED_FOLDER_SECONDS - 1
    os.utime(remaining, (expired_at, expired_at))
    cache.drop_expired()
    assert not remaining.exists()
