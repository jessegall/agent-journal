from core.modules.profiles.support.profile_files import ProfileFiles
from server.booting_work import BootingWork
from tests.stories.core.support.fixtures import UserJoined

NOTES_MODULE = "tests.stories.core.modules.profiles.support.notes_module:NotesModule"


def test_a_module_supplies_profiles_for_its_registered_type(new_story):
    story = new_story(NOTES_MODULE, fixture=UserJoined)
    story.container.get(ProfileFiles).publish()
    story.expect_text("profile list", "journal-notes-reader", actor=story.user)
    story.expect_success('profile save reader --type reader --description "Reads notes"', actor=story.user)


def test_a_module_supplies_its_standard_templates(new_story):
    story = new_story(NOTES_MODULE, fixture=UserJoined)
    BootingWork().run(story.container)
    story.run_listeners()
    story.expect_text("template list", "Summarize notes", actor=story.user)


def test_a_suite_supplies_a_role_without_changing_core(new_story):
    story = new_story(NOTES_MODULE, fixture=UserJoined)
    story.expect_text("agent start notes-reader claude reader --environment main", "role: reader")
    story.expect_text("agent list --role reader", "notes-reader")
