from tests.stories.core.support.agent_labels import agent_number
from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.support.coding_fixtures import BuilderStarted
import json
import pytest

from engine.command.bus import Bus
from engine.file.file_access import FileAccess
from engine.enums.command_category import CommandCategory
from engine.enums.tool_type import ToolType
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.commands.start_process_part.start_process_part import StartProcessPart
from core.modules.usage.support.status_files import StatusFiles
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process
from tests.stories.core.modules.usage.support.status_files import FIVE_HOURS_RESET, SEVEN_DAYS_RESET, full_status, save_status_file
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder, BuilderHelper
from tests.stories.core.support.fixtures import UserJoined
from engine.testing.expectations.expect_row import expect_row
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

HELPER_START = "agent start s-2 claude worker --parent {parent} --environment main"


@pytest.fixture
def joined_with_helper(new_story):
    story = new_story(fixture=UserJoined)
    return story, story.new_row_id(HELPER_START.format(parent=story.agent.id))



def test_a_worker_shows_the_context_and_cost_the_launcher_kept_from_its_output(new_story):
    story = new_story(fixture=UserJoined)
    helper = story.new_row_id(HELPER_START.format(parent=story.agent.id))
    save_status_file(story, "s-2", {"session_id": "s-2", "context_window": {"used_percentage": 20}, "cost": {"total_cost_usd": 1.5}})
    story.expect_text("usage agents --environment main --json", f'"id": {helper}', '"context_percent": 20', '"cost_dollars": 1.5', actor=story.user)


def test_each_agents_facts_carry_the_plan_windows_its_own_session_reported(new_story):
    story = new_story(fixture=UserJoined)
    full_status(story, "s-1", 42, 1.234)
    rows = json.loads(story.run("usage agents --environment main --json", actor=story.user).output_text)["rows"]
    story.expect_rows([(window["title"], window["used_percent"]) for window in rows[0]["windows"]] == [("5 hours", 30), ("7 days", 65)])


def test_an_agent_that_reported_no_windows_carries_the_account_windows_of_the_newest_report(joined_with_helper):
    story, helper = joined_with_helper
    save_status_file(story, "s-1", {"context_window": {"used_percentage": 20}, "rate_limits": {"five_hour": {"used_percentage": 30, "resets_at": FIVE_HOURS_RESET}, "seven_day": {"used_percentage": 65, "resets_at": SEVEN_DAYS_RESET}}})
    story.expect_text("usage show --environment main", "plan: 5 hours 30% used", actor=story.user)
    rows = json.loads(story.run("usage agents --environment main --json", actor=story.user).output_text)["rows"]
    helper_row = next(row for row in rows if row["id"] == helper)
    story.expect_rows([window["title"] for window in helper_row["windows"]] == ["5 hours", "7 days"])


def test_usage_outside_an_environment_is_refused_with_how_to_name_one(new_story):
    story = new_story(fixture=UserJoined)
    story.use_fixture_environment(None)
    story.expect_refusal("usage show", "usage is shown for one environment: name it with --environment", actor=story.user)


def test_the_usage_window_reads_the_usage(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_window_allowed("usage.usage", "usage show")


def test_the_cost_window_reads_the_usage(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_window_allowed("usage.cost", "usage show")


def test_the_bars_count_helpers_tasks_and_questions_and_name_the_main_agents_task(new_story):
    story = new_story(fixture=UserJoined)
    story.run(HELPER_START.format(parent=story.agent.id))
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.expect_text("usage bars --environment main", "1 helpers, 2 tasks, 0 waiting", actor=story.user)
    story.expect_text("usage bars --environment main --json", '"task_id": 1', '"task_title": "Fix the cart"', '"processes": 0', actor=story.user)


def test_an_agents_task_names_its_plan_and_a_task_of_no_plan_names_none(new_story):
    story = new_story(fixture=UserJoined)
    story.run('plan make "Cart plan" --environment main', actor=story.agent)
    story.run('phase make --plan 1 "Build"', actor=story.agent)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.run("phase place 1 --phase 1", actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.expect_text("usage agents --environment main --json", '"plan_title": "Cart plan"', actor=story.user)
    story.expect_text("usage bars --environment main --json", '"task_plan_id": 1', actor=story.user)
    story.expect_success("task test 1", actor=story.agent)
    story.expect_text("plan board --environment main --json", '"testing_count": 1', actor=story.user)


def test_the_tool_is_the_one_the_main_agent_began_until_it_stops(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.shell("ls build", ShellPart("ls", CommandCategory.SEARCH, ["build"])))
    story.expect_text("usage tool --environment main", "Bash ls build", actor=story.user)
    story.hook("s-1", HookSamples.stop())
    story.expect_absent("usage tool --environment main", "Bash", actor=story.user)


@pytest.fixture
def pending_test_chain(new_story):
    story = new_story(fixture=UserJoined)
    line = "cat notes && pytest -q"
    story.hook("s-1", HookSamples.shell(line, ShellPart("cat", CommandCategory.READ, ["notes"]), ShellPart("pytest", CommandCategory.TEST_RUN, ["-q"])))
    process = start_process(story, line)
    return story, process


def test_the_tool_of_a_running_chain_names_the_part_that_runs_now(pending_test_chain):
    story, process = pending_test_chain
    bus = story.container.get(Bus)
    bus.run(StartProcessPart(process.id, 1), story.agent, environment_id=process.environment_id)
    story.expect_text("usage tool --environment main", "Bash cat notes", actor=story.user)
    bus.run(EndProcessPart(process.id, 1, 0), story.agent, environment_id=process.environment_id)
    bus.run(StartProcessPart(process.id, 2), story.agent, environment_id=process.environment_id)
    story.expect_text("usage tool --environment main", "Bash pytest -q", actor=story.user)


def test_the_tool_of_a_chain_names_the_part_that_began_and_not_one_that_waits(pending_test_chain):
    story, process = pending_test_chain
    story.container.get(Bus).run(StartProcessPart(process.id, 2), story.agent, environment_id=process.environment_id)
    story.expect_text("usage tool --environment main", "Bash pytest -q", actor=story.user)


def test_the_tool_of_a_chain_that_ended_names_its_last_part_and_never_the_whole_chain(new_story):
    story = new_story(fixture=UserJoined)
    line = "cat notes && sed -n 1,2p notes"
    story.hook("s-1", HookSamples.shell(line, ShellPart("cat", CommandCategory.READ, ["notes"]), ShellPart("sed", CommandCategory.READ, ["-n", "1,2p", "notes"])))
    process = start_process(story, line)
    bus = story.container.get(Bus)
    bus.run(StartProcessPart(process.id, 1), story.agent, environment_id=process.environment_id)
    bus.run(EndProcessPart(process.id, 1, 0), story.agent, environment_id=process.environment_id)
    bus.run(StartProcessPart(process.id, 2), story.agent, environment_id=process.environment_id)
    bus.run(EndProcessPart(process.id, 2, 0), story.agent, environment_id=process.environment_id)
    story.expect_text("usage tool --environment main", "Bash sed -n 1,2p notes", actor=story.user)
    story.expect_absent("usage tool --environment main", "cat notes", actor=story.user)


def test_the_tool_says_whether_its_command_still_runs(new_story):
    story = install_runner(new_story(fixture=UserJoined))
    story.hook("s-1", HookSamples.shell("sleep 9", ShellPart("sleep", CommandCategory.READ, ["9"])))
    process = start_process(story, "sleep 9")
    story.expect_text("usage tool --environment main --json", '"running": true', actor=story.user)
    end_run(story, process, "")
    story.expect_text("usage tool --environment main --json", '"running": false', actor=story.user)


def test_the_tool_of_an_edit_shows_the_lines_it_adds_and_removes(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.edit("src/cart.py", 3, 1))
    story.expect_text("usage tool --environment main", "Edit src/cart.py +3 -1", actor=story.user)


def test_a_session_says_when_it_was_last_compacted(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("usage show --environment main --json", '"last_compacted_at": null', actor=story.user)
    story.hook("s-1", HookSamples.sample("compact"))
    story.expect_text("usage show --environment main --json", '"last_compacted_at": "2026', actor=story.user)


class NinetyTwoPercentCompacted(StoryFixture):
    """The real order: the session start hook of a compaction runs while the status file still holds the old percent."""

    parent = UserJoined

    def steps(self, story):
        story.report_context_percent("s-1", 92)
        story.hook("s-1", HookSamples.sample("compact"))
        story.hook("s-1", HookSamples.session_start().with_raw({"source": "compact"}))


def test_a_compaction_says_how_full_the_context_was_before_and_after(new_story):
    story = new_story(fixture=NinetyTwoPercentCompacted)
    story.report_context_percent("s-1", 18)
    story.hook("s-1", HookSamples.prompt("go on"))
    compaction = json.loads(story.run("usage show --environment main --json", actor=story.user).output_text)["agents"][0]["last_compaction"]
    expect_row(compaction, start_percent=92, end_percent=18)


def test_a_tick_after_a_compaction_start_reads_the_percent_the_status_file_gets_later(new_story):
    story = new_story(fixture=NinetyTwoPercentCompacted)
    story.tick("s-1")
    compaction = json.loads(story.run("usage show --environment main --json", actor=story.user).output_text)["agents"][0]["last_compaction"]
    expect_row(compaction, start_percent=92, end_percent=None)
    story.report_context_percent("s-1", 18)
    story.tick("s-1")
    compaction = json.loads(story.run("usage show --environment main --json", actor=story.user).output_text)["agents"][0]["last_compaction"]
    expect_row(compaction, start_percent=92, end_percent=18)


def test_a_compaction_not_yet_started_again_keeps_only_the_percent_before(new_story):
    story = new_story(fixture=UserJoined)
    story.report_context_percent("s-1", 70)
    story.hook("s-1", HookSamples.sample("compact"))
    compaction = json.loads(story.run("usage show --environment main --json", actor=story.user).output_text)["agents"][0]["last_compaction"]
    expect_row(compaction, start_percent=70, end_percent=None)


def test_with_no_tool_running_the_line_says_what_the_agent_waits_for(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.stop())
    story.expect_absent("usage tool --environment main", "waiting for", actor=story.user)
    story.run('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)
    story.expect_text("usage tool --environment main", "waiting for your answer to question 1", actor=story.user)
    story.run('question ask "Which cache?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)
    story.expect_text("usage tool --environment main", "waiting for your answers to 2 questions", actor=story.user)


def test_a_turn_with_no_tool_yet_is_thinking_until_it_begins_one_or_stops(new_story):
    story = new_story(fixture=UserJoined)
    thinking = lambda: json.loads(story.run("usage tool --environment main --json", actor=story.user).output_text)["thinking"]
    story.hook("s-1", HookSamples.prompt("fix the cart"))
    expect_asking(thinking, True)
    story.hook("s-1", HookSamples.edit("src/cart.py", 3, 1))
    expect_asking(thinking, False)
    story.hook("s-1", HookSamples.stop())
    expect_asking(thinking, False)


def test_an_open_question_says_it_asks(new_story):
    story = new_story(fixture=UserJoined)
    asking = lambda: json.loads(story.run("usage tool --environment main --json", actor=story.user).output_text)["asking"]
    story.hook("s-1", HookSamples.stop())
    expect_asking(asking, False)
    story.run('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --environment main', actor=story.agent)
    expect_asking(asking, True)


def test_the_agents_row_facts_name_the_task_an_agent_works_on(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.session_start())
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.run("task start 1", actor=story.agent)
    story.expect_text("usage agents --environment main --json", '"task_id": 1', '"task_title": "Fix the cart"', actor=story.user)


def test_a_helpers_facts_carry_its_profile_given_name_and_instruction(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    launcher = FakeLauncher.accepting(story.home.socket("launcher"))
    story.run(f'helper start {RESEARCHER_PROFILE.name} --model sonnet --name "Madame Curie" --brief "Read the cart" --environment main', actor=story.agent)
    launcher.server.close()
    story.expect_text("usage agents --environment main --json", f'"profile": "{RESEARCHER_PROFILE.name}"', '"given_name": "Madame Curie"', '"instruction": "Read the cart"')


def test_the_tool_of_a_helper_is_read_by_its_agent_number(new_story):
    story = new_story(fixture=BuilderHelper)
    story.hook("sub-1", HookSamples.edit("src/cart.py", 3, 1))
    story.expect_text(f"usage tool --agent {agent_number(story, story.helper.id)}", "Edit src/cart.py +3 -1", actor=story.agent)
    story.expect_absent(f"usage tool --agent {agent_number(story, story.agent.id)}", "Edit src/cart.py +3 -1", actor=story.agent)


def test_a_helper_s_chained_command_is_named_by_the_part_it_runs(new_story):
    story = install_runner(new_story(fixture=BuilderHelper))
    chained = HookSamples.shell("ls src && cat notes.md", ShellPart("ls", CommandCategory.PROCESS, ["src"]), ShellPart("cat", CommandCategory.PROCESS, ["notes.md"]))
    story.hook("sub-1", chained)
    story.expect_text(f"usage tool --agent {agent_number(story, story.helper.id)}", "ls src", actor=story.agent)
    story.expect_absent(f"usage tool --agent {agent_number(story, story.helper.id)}", "cat notes.md", actor=story.agent)


def test_a_helper_that_ran_no_command_says_so_plainly(new_story):
    story = new_story(fixture=BuilderHelper)
    story.expect_text(f"usage tool --agent {agent_number(story, story.helper.id)}", "has run no command yet", actor=story.agent)
    story.expect_text(f"usage tool --agent {agent_number(story, story.helper.id)} --json", '"note": "has run no command yet"', actor=story.agent)


def test_a_helper_that_stopped_after_a_command_says_nothing_of_having_run_none(new_story):
    story = new_story(fixture=BuilderHelper)
    story.hook("sub-1", HookSamples.edit("src/cart.py"))
    story.hook("sub-1", HookSamples.stop())
    story.expect_absent(f"usage tool --agent {agent_number(story, story.helper.id)}", "has run no command yet", actor=story.agent)


def test_agent_running_lists_every_running_agent_and_no_ended_one(new_story):
    story = new_story(fixture=BuilderStarted)
    story.expect_text("agent running --environment main", "main", actor=story.agent)
    story.expect_success(f"agent end {story.agent.id}", actor=story.agent)
    story.expect_absent("agent running --environment main", "main", actor=story.agent)


def ended_helper(story, session: str, windows: bool) -> None:
    helper = story.new_row_id(f"agent start {session} claude worker --parent {story.agent.id} --environment main")
    if windows:
        full_status(story, session, 10, 0.1)
    else:
        save_status_file(story, session, {"cost": {"total_cost_usd": 0.1}})
    story.expect_success(f"agent end {helper}", actor=story.user)
    story.run_listeners()


@pytest.fixture
def ended_worker_report(new_story):
    story = new_story(fixture=UserJoined)
    ended_helper(story, "s-2", windows=True)
    return story


@pytest.fixture
def ended_worker_without_windows(ended_worker_report):
    ended_helper(ended_worker_report, "s-3", windows=False)
    return ended_worker_report


def test_the_status_file_of_an_ended_session_is_removed_and_its_plan_windows_stay_in_plan_json(ended_worker_report):
    story = ended_worker_report
    expect_absent_exists_status_folder(story, "s-2.json")
    expect_file_status_folder(story, "plan.json")


def test_an_ended_sessions_report_stays_readable_for_its_card(ended_worker_report):
    story = ended_worker_report
    expect_file_status_folder_2(story, "ended", "s-2.json")
    expect_windows_status(story, "s-2")


def test_an_ended_sessions_status_file_can_disappear_during_the_read(ended_worker_report, monkeypatch):
    story = ended_worker_report
    path = story.home.status_folder / "ended" / "s-2.json"
    read = FileAccess.read

    def file_removing_read(access, file, *args, **kwargs):
        if file == path:
            path.unlink()
        return read(access, file, *args, **kwargs)

    monkeypatch.setattr(FileAccess, "read", file_removing_read)
    story.expect_text("usage agents --closed --environment main --json", '"cost_dollars": null', actor=story.user)
    story.expect_rows(not path.exists())


def expect_file_status_folder(story, text) -> None:
    actual = (story.home.status_folder / text).is_file()
    assert actual, actual


def expect_windows_status(story, text) -> None:
    actual = story.container.get(StatusFiles).status(text).windows
    assert actual, actual


def expect_file_status_folder_2(story, text, text_2) -> None:
    actual = (story.home.status_folder / text / text_2).is_file()
    assert actual, actual


def expect_path_status(story, text, expected) -> None:
    actual = sorted((path.name for path in story.home.status_folder.glob(text)))
    assert actual == expected, actual


def expect_absent_exists_status_folder(story, text) -> None:
    actual = (story.home.status_folder / text).exists()
    assert not actual, actual


def expect_asking(asking, expected) -> None:
    actual = asking()
    assert actual is expected, actual


def test_an_open_session_that_names_no_window_shows_no_figure_from_an_earlier_account(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    save_status_file(story, "ended-under-the-old-account", {"rate_limits": {"seven_day": {"used_percentage": 85, "resets_at": 1793000000}}})
    story.container.get(StatusFiles).retire("ended-under-the-old-account")
    story.expect_text("usage show --environment main", "plan: 7 days 85% used", actor=story.user)
    save_status_file(story, "s-1", {"context_window": {"used_percentage": 3}})
    story.expect_absent("usage show --environment main", "plan:", actor=story.user)
