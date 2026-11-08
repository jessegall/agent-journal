import importlib
import os

from core.testing.story_fixture import StoryFixture
from core.testing.template_databases import TemplateDatabases
from core.testing.template_prebuild import TemplatePrebuild

FIXTURES = """
from core.testing.story_fixture import StoryFixture


class PrebuildSample(StoryFixture):
    def steps(self, story):
        story.run("setting list")
"""


class NoRequests:
    def listed(self, fixtures):
        return []


class CountingTemplates:
    requests = NoRequests()

    def __init__(self):
        self.built = []

    def template(self, modules, fixture):
        self.built.append(fixture.__name__ if fixture else None)


class FileTemplates:
    requests = NoRequests()

    def __init__(self, folder):
        self.folder = folder

    def template(self, modules, fixture):
        (self.folder / (fixture.__name__ if fixture else "empty")).write_text(str(os.getpid()))


class Shallow(StoryFixture):
    pass


class Deep(StoryFixture):
    parent = Shallow


class TwoFixturePrebuild(TemplatePrebuild):
    def fixtures(self):
        return (Deep, Shallow)


def test_prebuild_builds_declared_fixtures(tmp_path, monkeypatch):
    tests = tmp_path / "prebuild_pkg" / "tests"
    tests.mkdir(parents=True)
    (tests.parent / "__init__.py").write_text("")
    (tests / "__init__.py").write_text("")
    (tests / "story_fixtures.py").write_text(FIXTURES)
    (tests / "not_a_fixture.py").write_text("# StoryFixture\nraise RuntimeError('does not import')\n")
    monkeypatch.syspath_prepend(str(tmp_path))
    templates = CountingTemplates()
    TemplatePrebuild(templates, tests, "prebuild_pkg.tests").run()
    assert None in templates.built and "PrebuildSample" in templates.built


def test_parent_fixture_builds_first(tmp_path):
    templates = CountingTemplates()
    TwoFixturePrebuild(templates, tmp_path).run()
    assert templates.built == [None, "Shallow", "Deep"]


def test_processes_share_builds(tmp_path):
    TwoFixturePrebuild(FileTemplates(tmp_path), tmp_path, processes=2).run()
    builders = {(tmp_path / name).read_text() for name in ("Shallow", "Deep")}
    assert len(builders) == 2


def test_requested_template_builds(tmp_path):
    class Requests:
        def listed(self, fixtures):
            return [(tuple(["sample:Module"]), Shallow)]

    templates = CountingTemplates()
    templates.requests = Requests()
    TwoFixturePrebuild(templates, tmp_path).run()
    assert templates.built.count("Shallow") == 2


def test_fixture_key_ignores_file_change(tmp_path, monkeypatch):
    source = tmp_path / "changing_fixture_module.py"
    source.write_text(FIXTURES)
    monkeypatch.syspath_prepend(str(tmp_path))
    fixture = importlib.import_module("changing_fixture_module").PrebuildSample
    key = TemplateDatabases.template_key((), fixture)
    source.write_text(FIXTURES + "# merged during the run\n")
    assert TemplateDatabases.template_key((), fixture) == key
