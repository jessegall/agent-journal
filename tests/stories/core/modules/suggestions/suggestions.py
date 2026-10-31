from datetime import timedelta

from tests.stories.core.support.fixtures import UserJoined

COMMANDMENTS_LOCK = '{"packages": [{"name": "jessegall/code-commandments"}]}'


def project_with_the_commandments_package(new_story):
    story = new_story(fixture=UserJoined)
    (story.home.project_folder / "composer.lock").write_text(COMMANDMENTS_LOCK)
    return story


def test_a_project_running_code_commandments_as_a_package_is_offered_the_plugin_after_the_first_round(new_story):
    story = project_with_the_commandments_package(new_story)
    story.advance(timedelta(minutes=16))
    story.run_listeners()
    story.expect_text("suggestion list", "Code Commandments runs here as a package. Run it as a journal plugin instead?", actor=story.user)


def test_a_project_without_the_package_is_offered_nothing(new_story):
    story = new_story(fixture=UserJoined)
    story.advance(timedelta(minutes=16))
    story.run_listeners()
    story.expect_absent("suggestion list", "Code Commandments", actor=story.user)


def test_an_answered_suggestion_is_never_made_again_and_cannot_be_answered_twice(new_story):
    story = project_with_the_commandments_package(new_story)
    story.advance(timedelta(minutes=16))
    story.run_listeners()
    story.expect_text("suggestion answer 1 declined", "declined", actor=story.user)
    story.advance(timedelta(minutes=61))
    story.run_listeners()
    story.expect_refusal("suggestion answer 1 accepted", "suggestion 1 was answered already: declined", actor=story.user)
    story.expect_absent("suggestion list --open", "Code Commandments", actor=story.user)
