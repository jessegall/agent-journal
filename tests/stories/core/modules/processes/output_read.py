from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.modules.processes.support.process_samples import ended_run, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted

REPORT = "setup\ntest_a PASSED\ntest_b FAILED\n2 failed, 1 passed in 0.4s\n"
PYTEST = "pytest -q"


def test_an_output_is_read_by_one_flag_and_none_is_refused(new_story):
    story = new_story(fixture=BuilderStarted)
    process = ended_run(story, PYTEST, REPORT)
    story.expect_refusal(f"output read {process.id}", "--summary, --all, --lines, --tail or --reader", actor=story.agent)


def test_all_lines_tail_and_a_range_show_the_output(new_story):
    story = new_story(fixture=BuilderStarted)
    process = ended_run(story, PYTEST, REPORT)
    story.expect_success(f"output read {process.id} --all", "setup", "test_a PASSED", "test_b FAILED", "2 failed, 1 passed in 0.4s", actor=story.agent)
    story.expect_success(f"output read {process.id} --tail 1", "2 failed, 1 passed in 0.4s", actor=story.agent)
    story.expect_success(f"output read {process.id} --lines 2-3", "2: test_a PASSED", "3: test_b FAILED", actor=story.agent)


def test_the_summary_says_how_the_run_ended_with_the_default_readers_lines(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('reader add tests --commands "pytest*" --lines "FAILED|passed" --summary "([0-9]+ failed.*)"', actor=story.agent)
    story.run("reader default tests", actor=story.agent)
    process = ended_run(story, PYTEST, REPORT, exit_code=1)
    story.expect_text(f"output read {process.id} --summary", f"output {process.id} failed with exit code 1", "3: test_b FAILED", "4: 2 failed, 1 passed in 0.4s", actor=story.agent)


def test_a_named_reader_reads_the_output_whatever_the_default_is(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('reader add passes --commands "none*" --lines "PASSED"', actor=story.agent)
    process = ended_run(story, PYTEST, REPORT)
    story.expect_success(f"output read {process.id} --reader passes", "2: test_a PASSED", actor=story.agent)
    story.expect_absent(f"output read {process.id} --reader passes", "3: test_b FAILED", actor=story.agent)


def test_a_pruned_output_says_so(new_story):
    story = new_story(fixture=BuilderStarted)
    process = ended_run(story, PYTEST, REPORT)
    story.run(f"output prune {process.id}", actor=story.agent)
    story.expect_text(f"output read {process.id} --all", f"output {process.id} was pruned", actor=story.agent)


def test_the_status_of_an_output_is_running_finished_or_failed_with_its_code(new_story):
    story = new_story(fixture=BuilderStarted)
    running = start_process(story, "make build")
    finished = ended_run(story, "ls", "a\n")
    failed = ended_run(story, PYTEST, REPORT, exit_code=4)
    story.expect_ordered_lines("output status", f"{running.id}  running", f"{finished.id}  finished", f"{failed.id}  failed with code 4", actor=story.agent)
    story.expect_text(f"output status {failed.id}", "failed with code 4", actor=story.agent)


def test_a_worker_lists_and_reads_only_its_own_outputs(new_story):
    story = new_story(fixture=BuilderStarted)
    main_run = ended_run(story, PYTEST, REPORT)
    worker = Actor(story.new_row_id("agent start s-9 claude worker --environment main"), ActorType.AGENT)
    story.expect_refusal(f"output read {main_run.id} --all", "is not yours", actor=worker)
    story.expect_text("output status", "nothing found", actor=worker)
