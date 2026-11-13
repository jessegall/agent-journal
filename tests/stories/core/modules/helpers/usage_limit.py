import json
from datetime import timedelta

from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.file.file_access import FileAccess
from engine.journal.journal_home import LAUNCHER_SOCKET
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.agent_activity import AgentActivity
from core.modules.drivers.commands.record_agent_notice.record_agent_notice import RecordAgentNotice
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from engine.driver.program_lockdown import ProgramLockdown
from core.modules.agents.support.terminal_typing import TerminalTyping
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.helpers.support.usage_lockdown import UsageLockdown
from core.modules.helpers.ticks.usage_limit_marker import UsageLimitMarker
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from tests.stories.core.support.coding_fixtures import BuilderStarted

LIMIT_SECONDS = 3600


def report_window(story: Story, percent: int) -> None:
    resets_at = story.clock.timestamp().value.timestamp() + LIMIT_SECONDS
    story.home.status_folder.mkdir(parents=True, exist_ok=True)
    report = {"session_id": "s-1", "model": {"display_name": "Opus"}, "context_window": {"used_percentage": 10}, "rate_limits": {"five_hour": {"used_percentage": percent, "resets_at": resets_at}}}
    FileAccess.write(story.home.status_folder / "s-1.json", json.dumps(report))


def limited_story(new_story) -> Story:
    story = new_story(fixture=BuilderStarted)
    story.container.bind(ProgramStates, story.container.constructed(ProgramStates))
    story.container.bind(ProgramLockdown, story.container.constructed(UsageLockdown))
    story.container.bind(TerminalTyping, story.container.constructed(TerminalTyping))
    return story


def read_agent(story: Story) -> Agent:
    return story.row(Agent, story.agent.id)


def waiting_line(story: Story) -> AgentLine:
    story.container.get(Bus).run(RecordAgentNotice(story.agent.id, "A message arrived", "messages.idle"), Actor.core(), environment_id=1)
    story.run_listeners()
    return story.container.get(Queries).query(AgentLine).filter(session_agent_id=story.agent.id, source="messages.idle").newest().first()


def test_agents_of_a_program_at_its_usage_limit_are_marked_and_get_no_lines_until_it_starts_again(new_story):
    story = limited_story(new_story)
    launcher = FakeLauncher.accepting(story.home.socket(LAUNCHER_SOCKET))
    try:
        story.hook("s-1", HookSamples.session_start())
        report_window(story, 100)
        UsageLimitMarker()(story.container)
        limited = read_agent(story)
        story.expect_rows(limited.usage_limit_ends_at is not None, limited.activity is AgentActivity.USAGE_LIMITED, detail=str(limited.usage_limit_ends_at))
        line = waiting_line(story)
        story.expect_rows(story.row(AgentLine, line.id).state is AgentLineState.WAITING)
        story.advance(timedelta(seconds=LIMIT_SECONDS + 10))
        UsageLimitMarker()(story.container)
        story.expect_rows(read_agent(story).usage_limit_ends_at is None, read_agent(story).activity is AgentActivity.WORKING)
        story.expect_rows(story.row(AgentLine, line.id).state is AgentLineState.ENTERED)
    finally:
        launcher.server.close()


def test_a_window_below_its_limit_marks_no_agent(new_story):
    story = limited_story(new_story)
    report_window(story, 98)
    UsageLimitMarker()(story.container)
    story.expect_rows(read_agent(story).usage_limit_ends_at is None)


def test_the_agent_card_says_it_is_at_the_usage_limit_and_when_the_allowance_starts_again(new_story):
    story = limited_story(new_story)
    report_window(story, 100)
    UsageLimitMarker()(story.container)
    card = json.loads(story.run("agent cards --include-main --json", actor=story.agent).output_text)["rows"][0]
    story.expect_rows(card["facts"]["state"] == "at usage limit", card["facts"]["usage_limit_ends_at"] == read_agent(story).usage_limit_ends_at.text, detail=str(card["facts"]))


def test_a_program_with_a_window_used_up_in_full_takes_no_new_agent_whatever_the_window_setting_says(new_story):
    story = limited_story(new_story)
    states = story.container.get(ProgramStates)
    report_window(story, 100)
    story.expect_rows(not states.allowance_state("claude").is_ready)
    story.advance(timedelta(seconds=LIMIT_SECONDS + 10))
    story.expect_rows(states.allowance_state("claude").is_ready)
