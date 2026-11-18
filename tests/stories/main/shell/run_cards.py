from journal.features.shell.jobs.watch_refresh import COMPLETE_WAIT_SECONDS
from journal.features.shell.shell_nudges import ShellNudges
from journal.features.shell.support.output_views import COMPLETE_UNENDED_LINE
from journal.features.shell.support.silent_runs import SILENCE_SECONDS
from journal.features.tasks.states.ready import Ready
from journal.features.workers.workers_options import BUILDER_MODE
from journal.support.agent_role import AgentRole
from tests.stories.builder.story_marks import story
from tests.stories.fixtures.main.working_agent import WorkingAgent


@story(WorkingAgent, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_background_test_run_that_prints_nothing_is_told_once_to_stream_and_a_sleep_is_never_told(story):
    nap = story.agent_has_a_background_run_printing(story.agents.subject, "sleep 5")
    run = story.agent_has_a_background_run_printing(story.agents.subject, "./quiet/gotestsum -q")
    result = story.agent_is_quiet_past(story.agents.subject, SILENCE_SECONDS)
    result.expect_agent_told(story.agents.subject, ShellNudges.SILENT_RUN_HINT, n=run)
    result.expect_agent_not_told(story.agents.subject, ShellNudges.SILENT_RUN_HINT, n=nap)
    result = story.agent_is_quiet_past(story.agents.subject, SILENCE_SECONDS)
    result.expect_agent_not_told(story.agents.subject, ShellNudges.SILENT_RUN_HINT)
    story.background_run_ends(story.agents.subject, run)
    story.expect_stack(story.agents.subject, Ready)


@story(WorkingAgent, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_run_whose_card_title_shows_a_path_is_told_once_to_name_it_in_words_and_a_title_in_words_is_not(story):
    run = story.agent_has_a_background_run_printing(story.agents.subject, "./checks.sh --all")
    result = story.agent_is_quiet_past(story.agents.subject, 1)
    result.expect_agent_told(story.agents.subject, ShellNudges.FLAGGED_TITLE, n=run, card_title="Running ./checks.sh")
    story.agent_runs(story.agents.subject, f"output watch {run} --title 'Running the checks'")
    result = story.agent_is_quiet_past(story.agents.subject, 1)
    result.expect_agent_not_told(story.agents.subject, ShellNudges.FLAGGED_TITLE)
    story.background_run_ends(story.agents.subject, run)
    story.expect_stack(story.agents.subject, Ready)


@story(WorkingAgent, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_chained_runs_card_is_titled_by_its_test_run_never_by_the_sed_before_it(story):
    run = story.agent_has_a_background_run_printing(story.agents.subject, "sed -n 1p notes.txt && ./chain/gotestsum -q")
    story.running_commands_are_read_again(1)
    story.expect_run_card_titled(run, "Testing")
    story.background_run_ends(story.agents.subject, run)
    story.expect_stack(story.agents.subject, Ready)


@story(WorkingAgent, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_two_run_lines_under_one_card_title_are_told_once_naming_both(story):
    first = story.agent_has_a_background_run_printing(story.agents.subject, "./unit/gotestsum -q")
    second = story.agent_has_a_background_run_printing(story.agents.subject, "./unit/gotestsum -x")
    result = story.agent_is_quiet_past(story.agents.subject, 1)
    result.expect_agent_told(story.agents.subject, ShellNudges.SHARED_TITLE, first_line="./unit/gotestsum -q", second_line="./unit/gotestsum -x")
    result = story.agent_is_quiet_past(story.agents.subject, 1)
    result.expect_agent_not_told(story.agents.subject, ShellNudges.SHARED_TITLE)
    story.background_run_ends(story.agents.subject, first)
    story.background_run_ends(story.agents.subject, second)
    story.expect_stack(story.agents.subject, Ready)


@story(WorkingAgent, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_two_run_lines_under_one_card_title_that_have_both_failed_are_never_told_to_share_a_title(story):
    first = story.agent_has_a_background_run_printing(story.agents.subject, "./done/gotestsum -q")
    second = story.agent_has_a_background_run_printing(story.agents.subject, "./done/gotestsum -x")
    story.background_run_ends(story.agents.subject, first, status=1)
    story.background_run_ends(story.agents.subject, second, status=1)
    result = story.agent_is_quiet_past(story.agents.subject, 1)
    result.expect_agent_not_told(story.agents.subject, ShellNudges.SHARED_TITLE)
    story.expect_stack(story.agents.subject, Ready)


@story(WorkingAgent, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_run_sharing_its_title_with_a_finished_one_is_the_run_told_to_take_a_title(story):
    first = story.agent_has_a_background_run_printing(story.agents.subject, "./later/gotestsum -q")
    story.background_run_ends(story.agents.subject, first)
    second = story.agent_has_a_background_run_printing(story.agents.subject, "./later/gotestsum -x")
    result = story.agent_is_quiet_past(story.agents.subject, 1)
    result.expect_agent_told(story.agents.subject, ShellNudges.SHARED_TITLE, n=second, first_line="./later/gotestsum -q", second_line="./later/gotestsum -x")
    story.background_run_ends(story.agents.subject, second)
    story.expect_stack(story.agents.subject, Ready)


@story(WorkingAgent, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_runs_differing_only_in_their_arguments_under_a_readers_topic_are_never_told_to_share_a_title(story):
    story.agent_runs(story.agents.subject, r"reader add unit-runs --pattern '[0-9]+ passed' --about 'a unit runs summary' --label 'Running tests' --commands gotestsum --topic '(\S+\.py)'")
    first = story.agent_has_a_background_run_printing(story.agents.subject, "./topic/gotestsum a_test.py -x")
    story.agent_runs(story.agents.subject, f"output watch {first} --reader unit-runs")
    second = story.agent_has_a_background_run_printing(story.agents.subject, "./topic/gotestsum a_test.py -q")
    story.agent_runs(story.agents.subject, f"output watch {second} --reader unit-runs")
    result = story.agent_is_quiet_past(story.agents.subject, 1)
    result.expect_agent_not_told(story.agents.subject, ShellNudges.SHARED_TITLE)
    story.background_run_ends(story.agents.subject, first)
    story.background_run_ends(story.agents.subject, second)
    story.expect_stack(story.agents.subject, Ready)


@story(WorkingAgent, mode=BUILDER_MODE, subject=AgentRole.MAIN)
def test_a_watched_run_standing_at_its_whole_bar_for_a_minute_is_named_once_to_the_agent_and_on_its_card(story):
    run = story.agent_has_a_background_run_printing(story.agents.subject, "./full/gotestsum", "a_test.go ok [100%]")
    result = story.agent_runs(story.agents.subject, r"reader add go-bar --pattern '^FAILED|[0-9]+ passed' --finished '[0-9]+ passed' --failed '^FAILED' --progress '\[ *([0-9]+)%\]' --label 'Running tests' --about 'a go run and its bar' --commands gotestsum")
    result.expect_command_passed()
    result = story.agent_runs(story.agents.subject, f"output watch {run} --reader go-bar")
    result.expect_command_passed()
    story.running_commands_are_read_again(1)
    result = story.running_commands_are_read_again(COMPLETE_WAIT_SECONDS - 2)
    result.expect_agent_not_told(story.agents.subject, ShellNudges.COMPLETE_PROGRESS_RUN)
    result = story.running_commands_are_read_again(3)
    result.expect_agent_told(story.agents.subject, ShellNudges.COMPLETE_PROGRESS_RUN, n=run)
    story.expect_run_card_saying(run, COMPLETE_UNENDED_LINE)
    result = story.running_commands_are_read_again(5)
    result.expect_agent_not_told(story.agents.subject, ShellNudges.COMPLETE_PROGRESS_RUN)
    story.background_run_ends(story.agents.subject, run)
    story.expect_stack(story.agents.subject, Ready)
