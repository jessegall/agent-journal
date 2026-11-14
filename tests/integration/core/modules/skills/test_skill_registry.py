from engine.database.database import Database
from engine.registry.registry import Registry
from engine.skill.skill_digest import SkillDigest
from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from engine.testing.expectations.expect_row import expect_row

MODULES = (f"{PATH}:GoodSkillsModule", f"{PATH}:PlanSkillsModule")


def test_the_registry_keeps_a_skill_entry_for_every_declaration_of_two_modules(played):
    story = played(UserJoined, *MODULES)
    skills = {skill.folder: skill for skill in Registry.read(story.container.get(Database)).skills}
    expect_journal_flowcharts_messages_limit("journal-flowcharts", "journal-messages", "journal-notes", "journal-roadmaps", "journal-shell", "journal-chores", set(skills))
    expect_module_journal_roadmaps(skills, "planskills")
    expect_absent_journal_roadmaps(skills)
    expect_row(skills["journal-notes"], digest=SkillDigest.digest("---\nname: journal-notes\ndescription: How to take notes\n---\n\nWrite a note for every decision.\n"))




def expect_module_journal_roadmaps(skills, expected) -> None:
    actual = skills['journal-roadmaps'].module
    assert actual == expected, actual


def expect_absent_journal_roadmaps(skills) -> None:
    actual = skills['journal-roadmaps'].shipped
    assert not actual, actual


def expect_journal_flowcharts_messages_limit(text, text_2, text_3, text_4, text_5, text_6, expected) -> None:
    actual = {text, text_2, text_3, text_4, text_5, text_6}
    assert actual <= expected, actual
