from core.modules.helpers.types.helper import Helper
from suites.coding.modules.workers.types.worker import Worker
import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.tool_type import ToolType
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.skills.support.profile_skills import ProfileSkills
from core.modules.skills.support.skill_requirement import SkillRequirement
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.support.story_checks import expect_value
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

PROFILE = "note-taker"
LISTED = "journal,journal-tasks,journal-rules"
REQUIRED = "journal-rules"
UNLISTED_SKILL = "journal-dumps"
SAVE = f'profile save {PROFILE} --type helper --access read-only --description "Takes notes" --body "Take notes."'
SESSION = "s-notes"


@pytest.fixture
def person(played):
    story = played(OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.replace(SkillRequirement, SkillRequirement())
    story.run("skill write")
    return story


@pytest.fixture
def saved(person):
    person.expect_success(f"{SAVE} --skills {LISTED} --required-skills {REQUIRED}", actor=person.user)
    return person


def started_agent(story, session: str, profile: str, role: str) -> Actor:
    story.run_command(StartAgent(session, "claude", role, story.agent.id, profile=profile), Actor.core(), 1)
    agent = hook_agent(story, story.hook(session, HookSamples.session_start().with_fields(session=session)))
    story.run_listeners()
    return agent


def started_helper(story, session: str, profile: str) -> Actor:
    return started_agent(story, session, profile, Helper.key)


@pytest.fixture
def note_taker(saved) -> Actor:
    return started_helper(saved, SESSION, PROFILE)


def row(story, profile: str, folder: str):
    return next(skill for skill in story.container.get(ProfileSkills).rows(story.container.get(ProfileFiles).effective(profile)) if skill.folder == folder)














def test_the_mark_is_kept_in_the_profile_file_over_a_restart(saved):
    expect_value(saved.container.get(ProfileFiles).row(PROFILE).required_skills, (REQUIRED,))


def test_a_shipped_profile_keeps_a_required_mark_a_person_set_and_shows_it_changed(person):
    person.expect_success(f"profile save {RESEARCHER_PROFILE.name} --description 'Researches a question' --skills {LISTED} --required-skills {REQUIRED}", actor=person.user)
    profile = person.container.get(ProfileFiles).effective(f"{RESEARCHER_PROFILE.name}")
    person.expect_rows(profile.required_skills == (REQUIRED,), "required_skills" in profile.changed)












