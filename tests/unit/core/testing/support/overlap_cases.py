import os
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
    monkeypatch.setenv("PYTHONPATH", os.pathsep.join([str(root / "src"), str(root)]))
    pytester.makeconftest('pytest_plugins = ["core.testing.pytest_plugin"]')
    pytester.makepyfile(test_shared=STORIES)
