import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

from core.base.code_copy import IGNORED

CHECKOUT = Path(__file__).resolve().parents[4]
STORY_SCRIPT = """
import json
import time
from pathlib import Path
import sys
import pytest
from core.testing.template_cache import TemplateCache
from core.testing.template_databases import TemplateDatabases
from tests.stories.core.support.fixtures import UserJoined

class CountingTemplateDatabases(TemplateDatabases):
    def __init__(self, folder):
        super().__init__(folder)
        self.builds = 0

    def synced_template(self, folder, modules):
        self.builds += 1
        return super().synced_template(folder, modules)

    def fixture_template(self, folder, modules, fixture):
        self.builds += 1
        return super().fixture_template(folder, modules, fixture)

started_seconds = time.perf_counter()
folder = TemplateCache(Path(sys.argv[1])).folder()
templates = CountingTemplateDatabases(folder)
story = templates.story(Path(sys.argv[2]), (), UserJoined)
story.expect_success("environment show 1", "name: main")
story.close()
print(json.dumps({"folder": str(folder), "builds": templates.builds, "seconds": time.perf_counter() - started_seconds}))
"""


def copy_checkout(folder):
    folder.mkdir()
    for name in ("src", "tests"):
        shutil.copytree(CHECKOUT / name, folder / name, symlinks=True, ignore=shutil.ignore_patterns(*IGNORED))


def run_first_story(checkout, cache, home):
    environment = {**os.environ, "PYTHONPATH": os.pathsep.join([str(checkout / "src"), str(checkout)])}
    answer = subprocess.run([sys.executable, "-c", STORY_SCRIPT, str(cache), str(home)], cwd=checkout,
                            env=environment, capture_output=True, text=True, timeout=60)
    assert answer.returncode == 0, answer.stdout + answer.stderr
    return json.loads(answer.stdout.splitlines()[-1])


def test_each_checkout_builds_its_own_template_and_reuses_it(tmp_path):
    first, second = tmp_path / "first", tmp_path / "second"
    copy_checkout(first)
    copy_checkout(second)
    initial = run_first_story(first, tmp_path / "cache", tmp_path / "first-story")
    other = run_first_story(second, tmp_path / "cache", tmp_path / "second-story")
    reused = run_first_story(second, tmp_path / "cache", tmp_path / "third-story")
    assert initial["builds"] > 0
    assert other["builds"] > 0
    assert initial["folder"] != other["folder"]
    expect_reused_template(other, reused)


def expect_reused_template(initial, reused):
    assert initial["builds"] > 0, initial
    assert reused["builds"] == 0, reused
    assert initial["folder"] == reused["folder"], (initial, reused)
