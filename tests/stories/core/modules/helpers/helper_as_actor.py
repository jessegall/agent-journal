from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent


def helper(story):
    return story.agent_actor(helper_agent(story).id)


def test_a_helper_is_shown_the_job_its_parent_sent(new_story):
    story = new_story(fixture=StartedHelper)
    story.expect_text("message work-source", "origin: job snapshot", actor=helper(story))


def test_the_parent_hears_of_a_report_its_helper_filed_and_reads_it_by_number(new_story):
    story = new_story(fixture=StartedHelper)
    filed = story.run('report make Findings --abstract "What was read" --body "The cart sums cents." --environment main', actor=helper(story))
    story.expect_rows(filed.code == 0, detail=filed.output_text)
    story.run_listeners()
    story.expect_text("report list", "Findings", actor=story.agent)


def test_a_report_with_no_body_is_refused_naming_the_body(new_story):
    story = new_story(fixture=StartedHelper)
    answer = story.run('report make Findings --abstract "What was read" --environment main', actor=helper(story))
    story.expect_rows(answer.code != 0 and "body" in answer.output_text, detail=answer.output_text)
