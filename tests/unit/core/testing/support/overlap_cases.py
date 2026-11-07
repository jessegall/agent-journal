import os
import sys
from pathlib import Path

STORIES = '''
def test_first(new_story):
    story = new_story()
    story.expect_success('actor make user "Ada"')
    story.expect_success('actor list')

def test_second(new_story):
    story = new_story()
    story.expect_success('actor make user "Ada"')
    story.expect_success('actor list')
'''


def configure_run(pytester, monkeypatch):
    root = Path(__file__).resolve().parents[5]
    monkeypatch.setenv("PYTHONPATH", os.pathsep.join(dict.fromkeys([str(root / "src"), str(root), *sys.path])))
    pytester.makeconftest('pytest_plugins = ["core.testing.pytest_plugin"]')
    pytester.makepyfile(test_shared=STORIES)


def configure_hooks(pytester, monkeypatch, second_path: str):
    configure_run(pytester, monkeypatch)
    pytester.makepyfile(test_shared=f'''
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.fixtures import UserJoined

def test_first(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.edit("cart.py"))
    story.expect_success("actor list")
    story.expect_success("actor list")

def test_second(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.edit({second_path!r}))
    story.expect_success("actor list")
    story.expect_success("actor list")
''')
