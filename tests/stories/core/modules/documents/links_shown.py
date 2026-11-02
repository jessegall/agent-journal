from tests.stories.core.support.coding_fixtures import BuilderStarted


def test_a_shown_row_lists_what_it_links_to_and_what_links_to_it(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.expect_success('report make "The totals" --abstract "The totals" --body "See task:1" --about tasks:1', "report 1: The totals, about task:1", actor=story.agent)
    story.run_listeners()
    story.expect_text("report show 1", "links: task:1", actor=story.agent)
    story.expect_text("task show 1", "links: report:1", actor=story.agent)


def test_a_new_report_and_a_new_plan_are_docked(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_success('report make "The totals" --abstract "The totals" --body "text"', "report 1: The totals", actor=story.agent)
    story.expect_success('plan make "The rebuild" --brief "all of it" --environment main', "state: draft", actor=story.agent)
    story.run_listeners()
    story.expect_text("dock-item list", "documents.report", "plans.draft", actor=story.agent)
