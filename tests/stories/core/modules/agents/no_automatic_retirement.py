import pytest

from core.modules.agents.models.agent import Agent
from core.modules.agents.testing.fake_launcher import FakeLauncher
from engine.query.queries import Queries
from tests.stories.core.modules.helpers.cold_sessions import with_job
from tests.stories.core.modules.helpers.helper_jobs import helper_agent
from tests.stories.core.modules.helpers.lifetime_reviewers import refusal_text
from tests.stories.core.modules.helpers.support.rotating_helper import ROTATING_BODY, EndedColdRotationHelper, story_with_profile_file

SILENT_MINUTES = 180
KEPT_LIMIT = "setting set journal.core.helpers.read-only-helper-profile-limits '[\"cooling:8:1\"]' --project"
SECOND_HELPER = "helper start cooling --brief 'Read src/tax.py' --fresh 'A second reader' --environment main"
CODEX_SAVE = 'profile save cooling --description "Reads one file" --body "' + ROTATING_BODY + '" --occupant when-cold --program codex --reason needed'


@pytest.fixture
def cooling(new_story):
    return story_with_profile_file(new_story, EndedColdRotationHelper)


def agents(story) -> list[Agent]:
    return list(story.container.get(Queries).query(Agent).all_rows())


def test_a_cold_replacement_a_refusal_at_the_kept_limit_and_a_profile_moved_to_another_program_retire_no_agent(cooling, monkeypatch):
    replaced, _ = with_job(cooling, monkeypatch, SILENT_MINUTES, 40)
    cooling.expect_success(KEPT_LIMIT, actor=cooling.user)
    refusal = refusal_text(cooling, SECOND_HELPER)
    cooling.expect_success(CODEX_SAVE, actor=cooling.user)
    launcher = FakeLauncher.listening(cooling.home.socket("launcher"), answer=b"started 702\n")
    cooling.run(f'helper send {replaced.number} "Read src/tax.py"', actor=cooling.agent)
    cooling.run_listeners()
    launcher.server.close()
    cooling.home.socket("launcher").unlink()
    helpers = [agent for agent in agents(cooling) if agent.profile == "cooling"]
    cooling.expect_rows("ask the person to retire one" in refusal, len(helpers) == 1, helpers[0].id == replaced.id, helper_agent(cooling).session != replaced.session,
                        all(agent.retired_at is None for agent in agents(cooling)), detail=f"{refusal} / {[(agent.number, agent.profile, agent.retired_at) for agent in agents(cooling)]}")
