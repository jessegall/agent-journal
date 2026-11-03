from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_brief_prints_the_log_lines_after_the_comments(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the total" --brief "Cents" --environment main', actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.run("task log 1 'the first step'", actor=story.agent)
    story.run("task log 1 'the second step'", actor=story.agent)
    story.expect_text("task brief 1", "log: the first step", "log: the second step", actor=story.agent)


def test_a_brief_with_no_log_prints_no_log_line(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the total" --brief "Cents" --environment main', actor=story.agent)
    story.expect_absent("task brief 1", "log:", actor=story.agent)
