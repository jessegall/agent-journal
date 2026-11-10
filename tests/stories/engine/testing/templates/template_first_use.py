from engine.testing.templates.template_cache import TemplateCache
from engine.testing.templates.template_databases import TemplateDatabases
from tests.stories.engine.setting.support.setting_samples import PATH
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

SAMPLE_MODULES = tuple([f"{PATH}:GoodModule"])


class CountingTemplateDatabases(TemplateDatabases):
    def __init__(self, folder):
        super().__init__(folder)
        self.builds = []

    def synced_template(self, folder, modules):
        self.builds.append(modules)
        return super().synced_template(folder, modules)

    def fixture_template(self, folder, modules, fixture):
        self.builds.append(fixture)
        return super().fixture_template(folder, modules, fixture)


def play_story(templates, folder, modules=()):
    story = templates.story(folder, modules, UserJoined)
    story.expect_success("environment show 1", "name: main")
    story.close()


def test_a_fixture_is_built_only_when_a_story_uses_it(tmp_path):
    templates = CountingTemplateDatabases(TemplateCache(tmp_path / "cache").folder())
    expect_value(templates.builds, [])
    play_story(templates, tmp_path / "story")
    expect_value(UserJoined in templates.builds, True)


def test_the_next_run_reuses_the_fixture_a_run_built(tmp_path):
    folder = TemplateCache(tmp_path / "cache").folder()
    play_story(CountingTemplateDatabases(folder), tmp_path / "first")
    next_run = CountingTemplateDatabases(folder)
    play_story(next_run, tmp_path / "second")
    expect_value(next_run.builds, [])


def test_the_next_run_reuses_a_fixture_built_for_named_modules(tmp_path):
    folder = TemplateCache(tmp_path / "cache").folder()
    play_story(CountingTemplateDatabases(folder), tmp_path / "first", SAMPLE_MODULES)
    next_run = CountingTemplateDatabases(folder)
    play_story(next_run, tmp_path / "second", SAMPLE_MODULES)
    expect_value(next_run.builds, [])


def test_a_story_of_one_fixture_builds_no_other_fixture(tmp_path):
    templates = CountingTemplateDatabases(TemplateCache(tmp_path / "cache").folder())
    play_story(templates, tmp_path / "story")
    expect_value(set(templates.builds) <= set((*UserJoined.chain(), ())), True)
