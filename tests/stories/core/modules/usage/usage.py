from tests.stories.core.support.coding_fixtures import BuilderStarted
import json
import pytest

from core.base.command.bus import Bus
from core.base.driver.command_category import CommandCategory
from core.base.driver.tool_type import ToolType
from core.modules.processes.commands.end_process_part.end_process_part import EndProcessPart
from core.modules.processes.commands.start_process_part.start_process_part import StartProcessPart
from core.modules.usage.support.status_files import StatusFiles
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner, start_process
from tests.stories.core.modules.usage.support.status_files import SEVEN_DAYS_RESET, full_status, save_status_file
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask, SubagentStarted
from tests.stories.core.support.fixtures import UserJoined
from core.testing.expect_row import expect_row

HELPER_START = "agent start s-2 claude worker --parent {parent} --environment main"


def test_each_open_agent_shows_its_model_context_and_cost_from_its_status_line(new_story):
    story = new_story(fixture=UserJoined)
    full_status(story, "s-1", 42, 1.234)
    story.expect_text("usage show --environment main", f"agent {story.agent.id}  s-1  claude  Opus  context 42%  cost $1.23", actor=story.user)


def test_the_plan_windows_show_how_much_is_used_and_when_each_starts_again(new_story):
    story = new_story(fixture=UserJoined)
    full_status(story, "s-1", 42, 1.234)
    story.expect_text("usage show --environment main", "plan: 5 hours 30% used, starts again 2026-11-01 15:00 UTC; 7 days 65% used, starts again 2026-11-05 11:00 UTC",
                      actor=story.user)


def test_a_window_the_program_left_out_of_its_report_is_left_out(new_story):
    story = new_story(fixture=UserJoined)
    save_status_file(story, "s-1", {"rate_limits": {"seven_day": {"used_percentage": 17, "resets_at": SEVEN_DAYS_RESET}}})
    story.expect_text("usage show --environment main", "plan: 7 days 17% used, starts again 2026-11-05 11:00 UTC", actor=story.user)


def test_an_agent_that_reported_nothing_says_so_the_plan_comes_from_the_newest_report_and_the_cost_adds_up(new_story):
    story = new_story(fixture=UserJoined)
    full_status(story, "s-1", 42, 1.234)
    helper = story.new_row_id(HELPER_START.format(parent=story.agent.id))
    story.expect_text("usage show --environment main", f"agent {helper}  s-2  claude  nothing reported yet", "plan: 5 hours 30% used",
                      "cost of the open sessions: $1.23", actor=story.user)
    save_status_file(story, "s-2", {"cost": {"total_cost_usd": 0.5}})
    story.expect_text("usage show --environment main", "cost of the open sessions: $1.73", actor=story.user)


def test_a_worker_shows_the_context_and_cost_the_launcher_kept_from_its_output(new_story):
    story = new_story(fixture=UserJoined)
    helper = story.new_row_id(HELPER_START.format(parent=story.agent.id))
    save_status_file(story, "s-2", {"session_id": "s-2", "context_window": {"used_percentage": 20}, "cost": {"total_cost_usd": 1.5}})
    story.expect_text("usage agents --environment main --json", f'"id": {helper}', '"context_percent": 20', '"cost_dollars": 1.5', actor=story.user)


def test_with_no_report_at_all_the_plan_says_nothing_is_reported_yet(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("usage show --environment main", f"agent {story.agent.id}  s-1  claude  nothing reported yet", "plan: no limits reported yet",
                      actor=story.user)


def test_an_ended_agent_is_left_out(new_story):
    story = new_story(fixture=UserJoined)
    helper = story.new_row_id(HELPER_START.format(parent=story.agent.id))
    story.expect_success(f"agent end {helper}", actor=story.user)
    story.expect_absent("usage show --environment main", f"agent {helper}  s-2  claude  nothing reported yet", actor=story.user)


def test_usage_outside_an_environment_is_refused_with_how_to_name_one(new_story):
    story = new_story(fixture=UserJoined)
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
    story.expect_text("usage bars --environment main --json", '"task_id": 1', '"task_title": "Fix the cart"', actor=story.user)


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


def test_the_tool_of_an_edit_shows_the_lines_it_adds_and_removes(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.edit("src/cart.py", 3, 1))
    story.expect_text("usage tool --environment main", "Edit src/cart.py +3 -1", actor=story.user)


def test_the_tool_of_an_edit_that_changes_no_line_shows_no_counts(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.edit("src/cart.py", 0, 0))
    story.expect_absent("usage tool --environment main", "+0", actor=story.user)


def test_a_session_says_when_it_was_last_compacted(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text("usage show --environment main --json", '"last_compacted_at": null', actor=story.user)
    story.hook("s-1", HookSamples.sample("compact"))
    story.expect_text("usage show --environment main --json", '"last_compacted_at": "2026', actor=story.user)


def test_the_usage_names_the_effort_the_session_reported(new_story):
    story = new_story(fixture=UserJoined)
    save_status_file(story, "s-1", {"model": {"display_name": "Opus"}, "effort": {"level": "high"}})
    expect_row(json.loads(story.run("usage show --environment main --json", actor=story.user).output_text)["agents"][0], effort="high")


def test_with_no_tool_running_the_line_says_what_the_agent_waits_for(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.stop())
    story.expect_absent("usage tool --environment main", "waiting for", actor=story.user)
    story.run('question ask "Which database?" --environment main', actor=story.agent)
    story.expect_text("usage tool --environment main", "waiting for your answer to question 1", actor=story.user)
    story.run('question ask "Which cache?" --environment main', actor=story.agent)
    story.expect_text("usage tool --environment main", "waiting for your answers to 2 questions", actor=story.user)


def test_a_turn_with_no_tool_yet_is_thinking_until_it_begins_one_or_stops(new_story):
    story = new_story(fixture=UserJoined)
    thinking = lambda: json.loads(story.run("usage tool --environment main --json", actor=story.user).output_text)["thinking"]
    story.hook("s-1", HookSamples.prompt("fix the cart"))
    assert thinking() is True
    story.hook("s-1", HookSamples.edit("src/cart.py", 3, 1))
    assert thinking() is False
    story.hook("s-1", HookSamples.stop())
    assert thinking() is False


def test_an_open_question_says_it_asks(new_story):
    story = new_story(fixture=UserJoined)
    asking = lambda: json.loads(story.run("usage tool --environment main --json", actor=story.user).output_text)["asking"]
    story.hook("s-1", HookSamples.stop())
    assert asking() is False
    story.run('question ask "Which database?" --environment main', actor=story.agent)
    assert asking() is True


def test_the_agents_row_facts_name_the_task_an_agent_works_on(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.session_start())
    story.run('task make "Fix the cart" --environment main', actor=story.user)
    story.run("task start 1", actor=story.agent)
    story.expect_text("usage agents --environment main --json", '"task_id": 1', '"task_title": "Fix the cart"', actor=story.user)


def test_an_agents_facts_carry_the_effort_it_runs_at(new_story):
    story = new_story(fixture=UserJoined)
    story.hook("s-1", HookSamples.session_start())
    story.expect_text("usage agents --environment main --json", '"effort": "high"', actor=story.user)


def test_a_subagents_facts_carry_its_profile_given_name_and_instruction(new_story):
    story = new_story(fixture=BuilderWithStartedTask)
    dispatch = {"subagent_type": "journal-researcher", "model": "sonnet", "description": "Madame Curie, reader of the cart", "prompt": "Read the cart"}
    story.hook("s-1", HookSamples.tool_use("Agent", ToolType.AGENT, [], None).with_raw({"tool_input": dispatch, "tool_use_id": "tool-1"}))
    story.hook("s-1", HookSamples.sample("session_start").with_fields(subagent="sub-1").with_raw({"agent_type": "journal-researcher"}))
    story.expect_text("usage agents --environment main --json", '"profile": "journal-researcher"', '"given_name": "Madame Curie"', '"instruction": "Read the cart"')


def test_the_tool_of_a_subagent_is_read_by_its_agent_number(new_story):
    story = new_story(fixture=SubagentStarted)
    story.hook("s-1", HookSamples.edit("src/cart.py", 3, 1).with_fields(subagent="sub-1"))
    story.expect_text(f"usage tool --agent {story.subagent.id}", "Edit src/cart.py +3 -1", actor=story.agent)
    story.expect_absent(f"usage tool --agent {story.agent.id}", "Edit src/cart.py +3 -1", actor=story.agent)


def test_a_subagent_s_chained_command_is_named_by_the_part_it_runs(new_story):
    story = install_runner(new_story(fixture=SubagentStarted))
    chained = HookSamples.shell("ls src && cat notes.md", ShellPart("ls", CommandCategory.PROCESS, ["src"]), ShellPart("cat", CommandCategory.PROCESS, ["notes.md"]))
    story.hook("s-1", chained.with_fields(subagent="sub-1"))
    story.expect_text(f"usage tool --agent {story.subagent.id}", "ls src", actor=story.agent)
    story.expect_absent(f"usage tool --agent {story.subagent.id}", "cat notes.md", actor=story.agent)


def test_a_subagent_that_ran_no_command_says_so_plainly(new_story):
    story = new_story(fixture=SubagentStarted)
    story.expect_text(f"usage tool --agent {story.subagent.id}", "has run no command yet", actor=story.agent)
    story.expect_text(f"usage tool --agent {story.subagent.id} --json", '"note": "has run no command yet"', actor=story.agent)


def test_a_subagent_that_stopped_after_a_command_says_nothing_of_having_run_none(new_story):
    story = new_story(fixture=SubagentStarted)
    story.hook("s-1", HookSamples.edit("src/cart.py").with_fields(subagent="sub-1"))
    story.hook("s-1", HookSamples.stop().with_fields(subagent="sub-1"))
    story.expect_absent(f"usage tool --agent {story.subagent.id}", "has run no command yet", actor=story.agent)


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
    assert not (story.home.status_folder / "s-2.json").exists() and (story.home.status_folder / "plan.json").is_file()


def test_the_status_file_of_a_session_with_no_plan_windows_is_removed_and_leaves_plan_json_as_it_was(ended_worker_without_windows):
    story = ended_worker_without_windows
    assert not (story.home.status_folder / "s-3.json").exists()
    story.expect_text("usage show --environment main", "plan: 5 hours 30% used", actor=story.user)


def test_the_plan_windows_are_still_shown_after_many_ended_sessions(ended_worker_report):
    story = ended_worker_report
    for number in range(3, 12):
        ended_helper(story, f"s-{number}", windows=True)
    assert sorted(path.name for path in story.home.status_folder.glob("*.json")) == ["plan.json"]
    story.expect_text("usage show --environment main", "plan: 5 hours 30% used, starts again 2026-11-01 15:00 UTC; 7 days 65% used", actor=story.user)


def test_an_ended_sessions_report_stays_readable_for_its_card(ended_worker_report):
    story = ended_worker_report
    assert (story.home.status_folder / "ended" / "s-2.json").is_file()
    assert story.container.get(StatusFiles).status("s-2").windows


def test_an_open_session_keeps_its_status_file_and_its_windows_win_over_plan_json(ended_worker_report):
    story = ended_worker_report
    save_status_file(story, "s-1", {"rate_limits": {"seven_day": {"used_percentage": 17, "resets_at": SEVEN_DAYS_RESET}}})
    story.expect_text("usage show --environment main", "plan: 7 days 17% used", actor=story.user)
    assert (story.home.status_folder / "s-1.json").is_file()
