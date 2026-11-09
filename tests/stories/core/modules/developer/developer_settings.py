from tests.stories.core.modules.drivers.hook_durations import UserBuilder, MASTER


def test_the_developer_tools_are_off_until_the_person_switches_them_on(new_story):
    story = new_story(fixture=UserBuilder)
    story.expect_success(f"setting show {MASTER}", "value: off", actor=story.user)
    story.run(f"setting switch {MASTER} on --project", actor=story.user)
    story.expect_no_text(f"setting show {MASTER}.hooks.terminal-nudges", "value: off", actor=story.user)
