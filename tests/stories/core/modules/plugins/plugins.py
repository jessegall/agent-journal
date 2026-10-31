from tests.stories.core.support.fixtures import UserJoined

PLUGIN_FOLDER = "/tmp/sample-plugin"


def test_an_agent_proposes_a_plugin_and_the_user_sees_what_it_would_run(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text(f'plugin propose {PLUGIN_FOLDER} --why "judges the code"', "proposed", actor=story.agent)
    story.expect_text("plugin list", "proposed", actor=story.user)


def test_installing_enabling_disabling_configuring_and_removing_are_the_users_alone(new_story):
    story = new_story(fixture=UserJoined)
    for line in (f"plugin install {PLUGIN_FOLDER}", "plugin enable sample", "plugin disable sample", "plugin configure sample --set level=2", "plugin remove sample"):
        story.expect_refusal(line, "only the user", actor=story.agent)


def test_with_no_plugin_installed_the_list_says_so(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("plugin list", "no plugin is installed", actor=story.user)
