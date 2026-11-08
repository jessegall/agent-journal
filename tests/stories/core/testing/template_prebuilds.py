from core.testing.template_cache import TemplateCache
from core.testing.template_databases import TemplateDatabases
from core.testing.template_prebuild import TemplatePrebuild
from tests.stories.core.base.setting.support.setting_samples import PATH
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

SAMPLE_MODULES = tuple([f"{PATH}:GoodModule"])


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


class OneFixturePrebuild(TemplatePrebuild):
    def fixtures(self):
        return tuple([UserJoined])


def expect_zero_builds(folder, tmp_path, modules):
    templates = CountingTemplateDatabases(folder)
    story = templates.story(tmp_path / "story", modules, UserJoined)
    story.expect_success("environment show 1", "name: main")
    story.close()
    expect_value(templates.builds, 0)


def test_a_story_after_the_prebuild_builds_no_template(tmp_path):
    folder = TemplateCache(tmp_path / "cache").folder()
    OneFixturePrebuild(TemplateDatabases(folder), tmp_path).run()
    expect_zero_builds(folder, tmp_path, ())


def test_a_story_naming_a_module_builds_no_template_in_the_next_run(tmp_path):
    root = tmp_path / "cache"
    first_templates = TemplateDatabases(root / "before-the-code-changed")
    first_templates.folder.mkdir(parents=True)
    first_templates.story(tmp_path / "earlier", SAMPLE_MODULES, UserJoined).close()
    folder = root / "after-the-code-changed"
    folder.mkdir()
    OneFixturePrebuild(TemplateDatabases(folder), tmp_path).run()
    expect_zero_builds(folder, tmp_path, SAMPLE_MODULES)
