import json
from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta

import pytest

from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.claude_code.providers.claude_code_provider import COMPACT_LINE as COMPACT
from core.modules.overview.support.overview_first import OverviewFirst
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_HARD_TOKENS, CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS, CONTEXT_LIMIT_CATEGORIES
from tests.stories.server.support.server_client import server_story
from engine.testing.examples.shell_part import ShellPart
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from engine.enums.tool_type import ToolType
from tests.stories.core.modules.processes.support.process_samples import moved_run
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.coding_fixtures import UserBuilder
from suites.coding.support.coding_settings import AUTO_MODE_SETTING

LIMIT_TOKENS = 400_000
HARD = 600_000
SESSION = "s-1"
COMPACTION_START = HookSamples.session_start().with_raw({"source": "compact"})
PRE_COMPACT = HookSamples.sample("compact").with_fields(accepts_lines=False)
CLEAR_START = HookSamples.session_start().with_raw({"source": "clear"})


class RecordedTyping(TerminalTyping):
    def __init__(self) -> None:
        self.typed: list[str] = []

    def send_line(self, agent_id: int, line: str) -> None:
        self.typed.append(line)


def typing_recorded(story):
    story.typing = RecordedTyping()
    story.replace(TerminalTyping, story.typing)
    return story


@pytest.fixture
def agent(new_story):
    return typing_recorded(new_story(fixture=UserBuilder))


class LimitEnabled(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        enabled_time(story, LIMIT_TOKENS)


class TaskOwner(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        started_task(story)


class TaskOwnerLimit(StoryFixture):
    parent = LimitEnabled

    def steps(self, story):
        started_task(story)


class TaskOwnerHardLimit(StoryFixture):
    parent = TaskOwnerLimit

    def steps(self, story):
        set_value(story, CONTEXT_LIMIT_HARD_TOKENS, HARD)


@pytest.fixture
def hard_limited_worker(new_story):
    return typing_recorded(new_story(fixture=TaskOwnerHardLimit))


@pytest.fixture
def limited_worker(new_story):
    return typing_recorded(new_story(fixture=TaskOwnerLimit))


@pytest.fixture
def limited(new_story):
    return typing_recorded(new_story(fixture=LimitEnabled))


@pytest.fixture
def task_worker(new_story):
    return typing_recorded(new_story(fixture=TaskOwner))


def has_context(story, tokens):
    save_status_file(story, SESSION, {"context_window": {"total_input_tokens": tokens}})


def set_value(story, key, value):
    story.expect_success(f"setting set {key} {value} --project", actor=story.user)


def enabled_time(story, tokens):
    set_value(story, CONTEXT_LIMIT_ENABLED, "true")
    set_value(story, CONTEXT_LIMIT_TOKENS, tokens)


def idle_turn(story):
    story.advance(timedelta(minutes=10))
    story.hook(SESSION, HookSamples.stop())


def started_task(story):
    story.expect_success('task make "Fix the cart" --brief "It adds tax twice"', actor=story.agent)
    story.expect_success("task start 1", actor=story.agent)


def test_with_the_switch_off_an_agent_is_never_compacted(agent):
    has_context(agent, 900_000)
    agent.tick(SESSION)
    stops(agent)
    agent.expect_rows(agent.typing.typed == [])


def expect_compaction_line(agent):
    agent.expect_rows(len(agent.typing.typed) == 1 and "compacted" in agent.typing.typed[0], detail=str(agent.typing.typed))


def test_a_tick_never_compacts_an_agent(agent):
    agent.hook(SESSION, HookSamples.stop())
    enabled_time(agent, LIMIT_TOKENS)
    has_context(agent, 900_000)
    agent.advance(timedelta(minutes=10))
    agent.tick(SESSION)
    agent.expect_rows(agent.typing.typed == [])


def test_an_agent_finishes_its_task_first_and_is_compacted_when_it_ends(task_worker):
    agent = task_worker
    enabled_time(agent, LIMIT_TOKENS)
    has_context(agent, LIMIT_TOKENS + 1)
    idle_turn(agent)
    agent.expect_rows(agent.typing.typed == [])
    agent.expect_success('task close 1 --outcome "Done"', actor=agent.agent)
    idle_turn(agent)
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))


def test_past_the_second_limit_an_agent_is_compacted_even_with_a_task_in_hand(agent):
    has_context(agent, HARD)
    set_value(agent, CONTEXT_LIMIT_HARD_TOKENS, HARD)
    enabled_time(agent, LIMIT_TOKENS)
    started_task(agent)
    idle_turn(agent)
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))


def test_past_the_second_limit_a_tool_is_refused_and_the_compaction_is_typed_at_once_with_a_task_in_hand(hard_limited_worker):
    agent = hard_limited_worker
    has_context(agent, HARD)
    agent.expect_hook_refusal(SESSION, HookSamples.edit("src/cart.py"), "no more tools, stop now")
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))
    agent.expect_hook_refusal(SESSION, HookSamples.edit("src/cart.py"), "no more tools, stop now")
    agent.expect_rows(agent.typing.typed == [COMPACT], detail="typed once while the last one runs")
    agent.advance(timedelta(minutes=10))
    agent.expect_hook_refusal(SESSION, HookSamples.edit("src/cart.py"), "no more tools, stop now")
    agent.expect_rows(agent.typing.typed == [COMPACT], detail="a tool use shows the typed line still waits in the program")


def journal_line(line):
    texts = [text.strip() for text in line.split("&&")]
    return HookSamples.shell(line, *(ShellPart(text.split()[0], CommandCategory.JOURNAL if text.startswith("journal ") else CommandCategory.READ, text.split()[1:]) for text in texts))


@pytest.mark.parametrize("line", ["journal message read 7", "journal message unread", "journal wait stuck full", "journal refusal skip workers.context-limit-hard-stop --reason wrong",
                                  "journal agent-block skip 3 --reason waits", "journal overview", "journal memory weigh 1 5", "journal memory list && journal message read 7"])
def test_past_the_second_limit_a_journal_command_a_stop_waits_on_still_runs(hard_limited_worker, line):
    agent = hard_limited_worker
    has_context(agent, HARD)
    agent.expect_hook_allowed(SESSION, journal_line(line))
    agent.expect_rows(agent.typing.typed == [], detail=str(agent.typing.typed))


@pytest.mark.parametrize("line", ["journal memory list && cat src/cart.py", "journal plan outline 3", "journal task show 3"])
def test_past_the_second_limit_a_line_that_also_runs_something_a_stop_never_waits_on_is_refused(hard_limited_worker, line):
    agent = hard_limited_worker
    has_context(agent, HARD)
    agent.expect_hook_refusal(SESSION, journal_line(line), "no more tools, stop now")


def test_past_the_second_limit_an_agent_with_an_unread_message_reads_it_and_its_stop_no_longer_names_the_message(hard_limited_worker):
    agent = hard_limited_worker
    agent.expect_success("message send 'look at the cart'", actor=agent.user)
    has_context(agent, HARD)
    agent.expect_hook_refusal(SESSION, HookSamples.edit("src/cart.py"), "no more tools, stop now")
    agent.expect_hook_allowed(SESSION, journal_line("journal message read 1"))
    agent.expect_success("message read 1", actor=agent.agent)
    stop = agent.hook(SESSION, HookSamples.stop())
    agent.expect_rows("unread" not in stop.refusal and "new message" not in stop.refusal, detail=stop.refusal)


def test_past_the_second_limit_a_stop_with_a_task_in_hand_and_an_unread_message_is_allowed_and_no_other_stop_rule_is_asked(hard_limited_worker):
    agent = hard_limited_worker
    agent.expect_success("message send 'look at the cart'", actor=agent.user)
    has_context(agent, HARD)
    agent.expect_hook_allowed(SESSION, HookSamples.stop())


def test_past_the_second_limit_a_stop_with_a_run_still_going_is_allowed_and_the_watch_of_the_run_still_passes(hard_limited_worker):
    agent = hard_limited_worker
    process = moved_run(agent, "make build")
    agent.run_listeners()
    has_context(agent, HARD)
    agent.expect_hook_allowed(SESSION, HookSamples.stop())
    monitor = HookSamples.tool_use("Monitor", ToolType.MONITOR, [], None)
    agent.expect_hook_refusal(SESSION, monitor.with_raw({"tool_input": {"command": "tail -f build.log"}}), "no more tools, stop now")
    agent.expect_hook_allowed(SESSION, monitor.with_raw({"tool_input": {"command": f"journal output monitor {process.id}"}}))


def test_between_the_limits_a_tool_with_a_task_in_hand_is_not_refused(hard_limited_worker):
    agent = hard_limited_worker
    has_context(agent, HARD - 1)
    agent.expect_hook_allowed(SESSION, HookSamples.edit("src/cart.py"))
    agent.expect_rows(agent.typing.typed == [], detail=str(agent.typing.typed))


def stops(story):
    story.hook(SESSION, HookSamples.prompt("go on"))
    story.hook(SESSION, HookSamples.stop())


def test_an_agent_that_stops_with_a_task_in_hand_is_not_compacted_at_the_stop(limited_worker):
    agent = limited_worker
    has_context(agent, LIMIT_TOKENS)
    agent.hook(SESSION, HookSamples.stop())
    agent.expect_rows(agent.typing.typed == [], detail=str(agent.typing.typed))


def test_an_agent_left_at_its_prompt_by_a_compaction_is_woken(agent):
    agent.hook(SESSION, COMPACTION_START)
    agent.advance(timedelta(seconds=40))
    agent.tick(SESSION)
    expect_compaction_line(agent)
    agent.advance(timedelta(seconds=40))
    agent.tick(SESSION)
    agent.expect_rows(len(agent.typing.typed) == 1, detail="woken once")
    agent.hook(SESSION, HookSamples.prompt("go on"))
    agent.advance(timedelta(seconds=40))
    agent.tick(SESSION)
    agent.expect_rows(len(agent.typing.typed) == 1, detail="not woken again once it was prompted")


@pytest.fixture
def overview_block(agent):
    agent.replace(OverviewFirst, OverviewFirst())
    agent.hook(SESSION, PRE_COMPACT)
    agent.hook(SESSION, COMPACTION_START)
    agent.advance(timedelta(seconds=40))
    return agent


def test_a_paused_agent_held_for_its_overview_is_not_woken(overview_block):
    agent = overview_block
    agent.expect_success(f"agent pause {agent_number(agent, agent.agent.id)}", actor=agent.user)
    agent.typing.typed.clear()
    agent.advance(timedelta(seconds=40))
    agent.tick(SESSION)
    agent.expect_rows(not any("compacted" in line for line in agent.typing.typed), detail=str(agent.typing.typed))


def test_an_agent_past_the_limit_that_finishes_its_task_is_told_to_stop_and_given_no_next_task(task_worker):
    agent = task_worker
    agent.expect_success('task make "Fix the basket" --brief "It drops items"', actor=agent.agent)
    agent.expect_success(f"setting set {AUTO_MODE_SETTING} true --environment main", actor=agent.user)
    enabled_time(agent, LIMIT_TOKENS)
    has_context(agent, LIMIT_TOKENS)
    agent.expect_success('task close 1 --outcome "Done"', actor=agent.agent)
    agent.run_listeners()
    agent.expect_success("task show 2", "state: open", actor=agent.agent)
    agent.expect_hook_allowed(SESSION, HookSamples.sample("post_tool_use"), "stop now")
    agent.expect_success('memory skip "nothing to keep"', actor=agent.agent)
    agent.hook(SESSION, HookSamples.stop())
    agent.expect_rows(agent.typing.typed == [COMPACT], detail=str(agent.typing.typed))


@pytest.fixture
def compacted_agent(limited):
    has_context(limited, LIMIT_TOKENS)
    idle_turn(limited)
    return limited


def apply_viewer_setting(story, key, value):
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        answer = server.viewer_line_value(cookie, {"window": "settings.settings", "environment": "main", "line": ["setting", "set", key, value, "--project"]})
    shown = story.run(f"setting show {key}", actor=story.user).output_text
    story.expect_rows(all(line in shown for line in json.loads(value)), detail=f"{answer} {shown}")


def test_a_cap_for_the_main_agents_kind_holds_it_in_place_of_the_size_for_all(limited):
    apply_viewer_setting(limited, CONTEXT_LIMIT_CATEGORIES, json.dumps(["main:none", "worker:200000"]))
    has_context(limited, 900_000)
    stops(limited)
    limited.expect_rows(limited.typing.typed == [], detail=str(limited.typing.typed))
    apply_viewer_setting(limited, CONTEXT_LIMIT_CATEGORIES, json.dumps(["main:300000"]))
    has_context(limited, 350_000)
    idle_turn(limited)
    stops(limited)
    limited.expect_rows(limited.typing.typed == [COMPACT], detail=str(limited.typing.typed))


def compact_window(story):
    settings = story.home.project_folder / ".claude" / "settings.json"
    return json.loads(settings.read_text()).get("autoCompactWindow") if settings.is_file() else None


def test_the_main_agents_folder_holds_the_hard_size_while_it_holds_a_task_and_its_own_size_after_and_its_stop_past_it_is_compacted(limited):
    limited.expect_success(f"environment edit 1 --folder {limited.home.project_folder}", actor=limited.user)
    started_task(limited)
    limited.run_listeners()
    limited.expect_rows(compact_window(limited) == HARD, detail=str(compact_window(limited)))
    limited.expect_success('task close 1 --outcome "Tax added once"', actor=limited.agent)
    limited.run_listeners()
    has_context(limited, LIMIT_TOKENS + 1)
    idle_turn(limited)
    limited.expect_rows(limited.typing.typed == [COMPACT], compact_window(limited) == LIMIT_TOKENS, detail=f"{limited.typing.typed} {compact_window(limited)}")
