from tests.stories.core.modules.processes.support.process_samples import BYTES_LONG, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted

STRANGER = "agent start s-9 claude worker --environment main"


def test_the_runner_reports_the_end_of_a_part_and_of_the_line_as_the_agent_that_ran_it(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    story.run("process part-end 1 --position 1 --exit-code 0", actor=story.agent)
    story.run("process part-end 1 --position 2 --exit-code 4", actor=story.agent)
    story.expect_ordered_lines("process-part list --process 1 --oldest", "finished", "failed")
    story.expect_success("process end 1 --exit-code 4 --bytes 5000 --lines 80", "state: failed", "exit_code: 4", actor=story.agent)
    story.expect_text("output list --process 1", "5000")


def test_another_agent_cannot_report_on_a_run_that_is_not_its_own(new_story):
    story = new_story(fixture=BuilderStarted)
    start_process(story)
    stranger = story.new_row_id(STRANGER)
    stranger_agent = type(story.agent)(stranger, story.agent.type)
    story.expect_refusal(f"process end 1 --exit-code 0 --bytes {BYTES_LONG} --lines 80", "cannot report its end", actor=stranger_agent)
    story.expect_refusal("process part-end 1 --position 1 --exit-code 0", "cannot report its parts", actor=stranger_agent)
    story.expect_success("process show 1", "state: running")
