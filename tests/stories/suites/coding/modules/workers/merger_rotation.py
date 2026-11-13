from datetime import timedelta

import pytest

from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.actor_type import ActorType
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from suites.coding.modules.workers.commands.start_merger.start_merger import StartMerger
from suites.coding.modules.workers.support.merger_work import MergerWork
from tests.stories.core.modules.helpers.helper_jobs import resumable_session
from tests.stories.core.modules.helpers.support.rotating_helper import real_program_states
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.merger_launcher import merger_can_start
from suites.coding.support.shipped_profiles import MERGER_PROFILE

TEST_ROWS_REASON = "the test reads every row it checks"

FALLBACK_LINE = "A worker waits for the merger"
MEMORY_TEXT = "Worker 2, task 1: advised a longer timeout"
OCCUPANT_SAVE = f"profile save {MERGER_PROFILE.name} --occupant {{occupant}} --reason needed"
PROGRAM_SAVE = f"profile save {MERGER_PROFILE.name} --program {{program}} --reason needed"
TWO_PROGRAM_SAVE = f"profile save {MERGER_PROFILE.name} --program claude --fallback-programs claude,codex --program-if-possible --reason needed"


@pytest.fixture
def merging(new_story, monkeypatch):
    merger_can_start(monkeypatch)
    monkeypatch.setattr(MergerWork, "has_waiting_work", lambda work: True)
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    return story


def declared_occupant(story, occupant: str) -> None:
    """Saves the merger's occupant as a user's change over the shipped profile, which declares each-launch."""
    story.expect_success(OCCUPANT_SAVE.format(occupant=occupant), actor=story.user)


def mergers(story) -> list[Agent]:
    return list(story.container.get(Queries).query(Agent).filter(profile=f"{MERGER_PROFILE.name}").every_row(TEST_ROWS_REASON))


def merger_launch(story) -> dict:
    launcher = FakeLauncher.accepting(story.home.socket("launcher"), answer=b"started 701\n")
    story.container.get(Bus).run(StartMerger(FALLBACK_LINE), Actor.core(), environment_id=1)
    story.run_listeners()
    launcher.drain_requests()
    launcher.server.close()
    story.home.socket("launcher").unlink()
    launches = [request for request in launcher.requests if "command" in request]
    story.expect_rows(len(launches) == 1, detail=str(launcher.requests))
    return launches[0]


def ended_merger(story, monkeypatch) -> Agent:
    merger_launch(story)
    merger = mergers(story)[0]
    story.expect_success(f"agent end {merger.id}", actor=story.agent)
    story.run_listeners()
    resumable_session(story, merger, monkeypatch)
    return merger


def test_the_first_merger_start_gives_one_agent_with_a_new_session(merging):
    command = merger_launch(merging)["command"]
    merging.expect_rows(len(mergers(merging)) == 1, "--resume" not in command, mergers(merging)[0].session in command, detail=str(command[:4]))


def test_a_later_merger_start_opens_a_job_on_the_idle_merger_under_a_new_session(merging, monkeypatch):
    merger = ended_merger(merging, monkeypatch)
    command = merger_launch(merging)["command"]
    current = mergers(merging)
    merging.expect_rows(len(current) == 1, current[0].id == merger.id, current[0].session != merger.session, "--resume" not in command,
                        agent_number(merging, current[0].id) == agent_number(merging, merger.id), detail=str(command[:4]))


def test_a_merger_profile_changed_to_codex_gives_the_same_agent_a_codex_session_and_retires_nobody(merging, monkeypatch):
    merger = ended_merger(merging, monkeypatch)
    merging.expect_success(f'memory make "{MEMORY_TEXT}" --weight 5', actor=Actor(merger.id, ActorType.AGENT))
    merging.expect_success(PROGRAM_SAVE.format(program="codex"), actor=merging.user)
    command = merger_launch(merging)["command"]
    current = mergers(merging)
    merging.expect_rows(len(current) == 1, current[0].id == merger.id, current[0].retired_at is None, current[0].program == "codex", command[0] == "codex", detail=str(command[:4]))
    merging.expect_text("memory list", MEMORY_TEXT, actor=Actor(merger.id, ActorType.AGENT))


def test_a_merger_whose_first_program_is_out_runs_on_its_second_and_returns_when_the_outage_ends(merging, monkeypatch):
    merger = ended_merger(merging, monkeypatch)
    merging.expect_success(TWO_PROGRAM_SAVE, actor=merging.user)
    real_program_states(merging)
    ends_at = (merging.clock.timestamp().value + timedelta(minutes=30)).isoformat()
    merging.expect_success(f'provider-outage make claude "rate limit" --ends-at {ends_at}', actor=merging.agent)
    during_outage = merger_launch(merging)["command"][0]
    merging.expect_success(f"agent end {merger.id}", actor=merging.agent)
    merging.run_listeners()
    merging.expect_success("provider-outage end claude", actor=merging.user)
    after_outage = merger_launch(merging)["command"][0]
    current = mergers(merging)
    merging.expect_rows(during_outage == "codex", after_outage == "claude", len(current) == 1, current[0].id == merger.id, current[0].retired_at is None,
                        detail=f"{during_outage} / {after_outage} / {current}")


@pytest.fixture
def when_cold_merger(merging, monkeypatch) -> Agent:
    declared_occupant(merging, "when-cold")
    return ended_merger(merging, monkeypatch)


def test_a_merger_kept_since_before_the_declaration_gets_a_new_session_at_its_next_start(merging, when_cold_merger):
    merger = when_cold_merger
    declared_occupant(merging, "each-launch")
    command = merger_launch(merging)["command"]
    current = mergers(merging)
    merging.expect_rows(len(current) == 1, current[0].id == merger.id, current[0].retired_at is None, current[0].session != merger.session, "--resume" not in command, detail=str(command[:4]))


def test_a_when_cold_merger_whose_program_is_changed_keeps_its_agent_and_nobody_is_retired(merging, when_cold_merger):
    merger = when_cold_merger
    merging.expect_success(PROGRAM_SAVE.format(program="codex"), actor=merging.user)
    merger_launch(merging)
    kept = list(merging.container.get(Queries).query(Agent).filter(profile=f"{MERGER_PROFILE.name}").matching(IsNull("retired_at")).every_row(TEST_ROWS_REASON))
    merging.expect_rows(len(mergers(merging)) == 1, len(kept) == 1, kept[0].id == merger.id, detail=str(mergers(merging)))
