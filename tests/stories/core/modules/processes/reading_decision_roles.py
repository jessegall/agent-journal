from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.helpers.helper_jobs import helper_agent
from tests.stories.core.modules.processes.support.cadence_probe import HelperBesideWorker, agent_run, kept_lines
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.modules.processes.support.reader_block_fixtures import ForcedReaders, worker_run
from tests.stories.core.modules.processes.support.reading_scenarios import (CRASHED_START, LONG_RUN, STEPS, end_decision, ended_after_a_while, received,
                                                                             rejected_worker_command)
from core.modules.processes.support.process_nudges import READONLY_MISSING_NOTICE
from engine.testing.expectations.expected_nudge import expected_nudge

ASKING = "collected 2 items\n<Module tests/cart.py>\n"
LOOKUPS = (("cat big.log", CommandCategory.READ), ("grep -rn cart src", CommandCategory.SEARCH), ("sed -i s/a/b/ notes", CommandCategory.EDIT),
           ("journal task list", CommandCategory.JOURNAL))


def test_a_read_only_helpers_run_with_no_reader_is_not_told_but_counted_for_the_main_agent(new_story):
    story = install_runner(new_story(fixture=HelperBesideWorker))
    helper = helper_agent(story)
    process = ended_after_a_while(story, agent_run(story, helper, "custom-scan run", CommandCategory.BUILD), STEPS)
    helper_lines = received(story, helper.session)
    story.hook("s-1", HookSamples.session_start())
    story.run_listeners()
    story.expect_rows(end_decision(story, process)[0] == "missing", "no reader reads" not in helper_lines, detail=helper_lines)
    story.expect_rows(expected_nudge(READONLY_MISSING_NOTICE, count=1).matches_text(kept_lines(story)), detail=kept_lines(story))


def test_one_command_without_a_reader_is_missing_for_a_worker_and_the_main_agent_alike_while_rejected_crashed_asking_and_lookup_runs_need_none(new_story):
    story = new_story(fixture=ForcedReaders)
    worker = ended_after_a_while(story, worker_run(story, "custom-build run", CommandCategory.TEST_RUN), STEPS)
    main = ended_after_a_while(story, start_process(story, "custom-build run", category=CommandCategory.TEST_RUN), STEPS)
    rejected = rejected_worker_command(story)
    crashed = start_process(story, "custom-suite run", category=CommandCategory.TEST_RUN)
    story.advance(LONG_RUN)
    end_run(story, crashed, CRASHED_START, exit_code=1)
    asking = ended_after_a_while(story, start_process(story, "pytest --collect-only", category=CommandCategory.TEST_RUN), ASKING)
    lookups = [ended_after_a_while(story, start_process(story, line, category=category), STEPS) for line, category in LOOKUPS]
    needless = [end_decision(story, process) for process in (rejected, crashed, asking, *lookups)]
    story.expect_rows(end_decision(story, main) == ("missing", "suggest", 1), end_decision(story, worker)[0] == "missing", end_decision(story, worker)[2] > 1,
                      all(decision == ("not needed", "nothing", 1) for decision in needless), detail=str(needless))
    story.expect_text("reader-request list", "command rejected before it ran", actor=story.agent)
