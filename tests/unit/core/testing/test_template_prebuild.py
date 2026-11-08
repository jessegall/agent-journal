from core.testing.template_prebuild import TemplatePrebuild

FIXTURES = """
from core.testing.story_fixture import StoryFixture


class PrebuildSample(StoryFixture):
    def steps(self, story):
        story.run("setting list")
"""


class CountingTemplates:
    def __init__(self):
        self.built = []

    def template(self, modules, fixture):
        self.built.append(fixture.__name__ if fixture else None)


def test_every_declared_fixture_and_the_empty_template_are_built_before_the_runners(tmp_path, monkeypatch):
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
