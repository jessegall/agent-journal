from tests.stories.core.modules.plugins.hooks import installed_story


def test_a_plugin_line_is_in_the_system_log_at_its_level_under_its_name(new_story):
    story = installed_story(new_story)
    story.expect_success('plugin log sample --level error "the queue is full"', actor=story.user)
    story.expect_text("developer system-logs --level error", "plugin sample: the queue is full", actor=story.user)
    story.expect_no_text("developer system-logs --level warning", "the queue is full", actor=story.user)


def test_a_plugin_line_without_a_level_is_information(new_story):
    story = installed_story(new_story)
    story.expect_success('plugin log sample "it started"', actor=story.user)
    story.expect_text("developer system-logs --level info", "plugin sample: it started", actor=story.user)
