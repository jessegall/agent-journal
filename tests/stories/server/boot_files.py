import shutil

from engine.testing.stories.story_fixture import StoryFixture
from server.work.booting_work import BootingWork
from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.coding_fixtures import BuilderStarted

READER = "cart-test"
PLUGIN_SKILL = "sample-rules"
JOURNAL_SKILL = "journal-notes"
SKILLS_MODULE = f"{PATH}:GoodSkillsModule"
SKILL_FOLDERS = (".claude/skills",)


def booted(story):
    BootingWork().run(story.container)
    story.run_listeners()


class PluginInstalled(StoryFixture):
    parent = BuilderStarted

    def steps(self, story):
        folder = sample_plugin_folder(story.home.folder.parent)
        readers = folder / ".journal-plugin" / "readers"
        readers.mkdir(parents=True, exist_ok=True)
        (readers / f"{READER}.pattern").write_text("title: Cart tests\n^(ok|FAIL)\\s\nfinished: ^ok\n")
        story.expect_success(f"plugin install {folder} --yes", actor=story.user)


def installed_plugin(new_story):
    story = new_story(SKILLS_MODULE, fixture=PluginInstalled)
    booted(story)
    return story


def skill_files(story, name):
    return [story.home.project_folder / skills / name / "SKILL.md" for skills in SKILL_FOLDERS]


def test_a_boot_puts_back_the_journals_skills_for_every_program(new_story):
    story = installed_plugin(new_story)
    for skill_file in skill_files(story, JOURNAL_SKILL):
        shutil.rmtree(skill_file.parent)
    booted(story)
    story.expect_rows(*(skill_file.is_file() for skill_file in skill_files(story, JOURNAL_SKILL)))


def test_a_boot_keeps_an_installed_plugin_switched_on(new_story):
    story = installed_plugin(new_story)
    booted(story)
    story.expect_text("plugin list", "sample", "on", actor=story.user)
