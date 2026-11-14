import shutil
from pathlib import Path

from engine.provider.providers import Providers

from server.work.booting_work import BootingWork
from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.modules.skills.support.removed_skill import is_skill_restored
from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.coding_fixtures import BuilderStarted

READER = "cart-test"
PLUGIN_SKILL = "sample-rules"
SKILLS_MODULE = f"{PATH}:GoodSkillsModule"


def skill_files(story, name: str) -> list[Path]:
    """Where each agent program keeps the skill, in the project."""
    return [story.home.project_folder / program_folder / name / "SKILL.md" for program_folder in story.container.get(Providers).skill_folders()]


def booted(story):
    BootingWork().run(story.container)
    story.run_listeners()


def installed_plugin(new_story):
    story = new_story(SKILLS_MODULE, fixture=BuilderStarted)
    folder = sample_plugin_folder(story.home.folder.parent)
    readers = folder / ".journal-plugin" / "readers"
    readers.mkdir(parents=True, exist_ok=True)
    (readers / f"{READER}.pattern").write_text("title: Cart tests\n^(ok|FAIL)\\s\nfinished: ^ok\n")
    story.expect_success(f"plugin install {folder} --yes", actor=story.user)
    booted(story)
    return story


def test_a_boot_puts_back_the_journals_skills(new_story):
    story = installed_plugin(new_story)
    story.expect_rows(is_skill_restored(story, booted))


def test_a_boot_puts_back_the_skills_of_a_plugin_that_is_switched_on(new_story):
    story = installed_plugin(new_story)
    published = [file for file in skill_files(story, PLUGIN_SKILL) if file.is_file()]
    for skill_file in published:
        shutil.rmtree(skill_file.parent)
    booted(story)
    story.expect_rows(bool(published), *(skill_file.is_file() for skill_file in published))


def test_a_boot_puts_back_a_reader_a_plugin_ships_and_the_project_removed(new_story):
    story = installed_plugin(new_story)
    story.expect_success(f"reader remove {READER}", actor=story.user)
    story.expect_absent("reader list", READER, actor=story.user)
    booted(story)
    story.expect_text("reader list", READER, actor=story.user)


def test_a_boot_keeps_an_installed_plugin_switched_on(new_story):
    story = installed_plugin(new_story)
    booted(story)
    story.expect_text("plugin list", "sample", "on", actor=story.user)
