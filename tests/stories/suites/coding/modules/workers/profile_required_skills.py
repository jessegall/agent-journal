import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.command.bus import Bus
from engine.enums.tool_type import ToolType
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.skills.support.profile_skills import ProfileSkills
from core.modules.skills.support.skill_requirement import SkillRequirement
from engine.testing.examples.hook_samples import HookSamples
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
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
def person(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.bind(SkillRequirement, SkillRequirement())
    story.run("skill write")
    return story


@pytest.fixture
def saved(person):
    person.expect_success(f"{SAVE} --skills {LISTED} --required-skills {REQUIRED}", actor=person.user)
    return person


def started_agent(story, session: str, profile: str, role: str) -> Actor:
    story.container.get(Bus).run(StartAgent(session, "claude", role, story.agent.id, profile=profile), Actor.core(), environment_id=1)
    agent = hook_agent(story, story.hook(session, HookSamples.session_start().with_fields(session=session)))
    story.run_listeners()
    return agent


def started_helper(story, session: str, profile: str) -> Actor:
    return started_agent(story, session, profile, CodingHelperRole.HELPER)


@pytest.fixture
def note_taker(saved) -> Actor:
    return started_helper(saved, SESSION, PROFILE)


def row(story, profile: str, folder: str):
    return next(skill for skill in story.container.get(ProfileSkills).rows(story.container.get(ProfileFiles).effective(profile)) if skill.folder == folder)


def test_a_skill_of_the_profile_can_be_marked_required(saved):
    saved.expect_text(f"profile skills --profile {PROFILE}", f"{REQUIRED}: on, required", "journal-tasks: on", actor=saved.user)
    saved.expect_no_text(f"profile skills --profile {PROFILE}", "journal-tasks: on, required", actor=saved.user)


def test_a_skill_nobody_has_cannot_be_required(person):
    person.expect_refusal(f"{SAVE} --skills {LISTED} --required-skills no-such-skill", "no-such-skill", actor=person.user)


def test_switching_the_skill_off_clears_its_required_mark(saved):
    saved.expect_success(f"profile save {PROFILE} --skills journal,journal-tasks", actor=saved.user)
    saved.expect_rows(row(saved, PROFILE, REQUIRED).required is False, row(saved, PROFILE, REQUIRED).listed is False)


def test_a_save_that_names_no_required_skills_leaves_them_as_they_are(saved):
    saved.expect_success(f'profile save {PROFILE} --title "Note taker"', actor=saved.user)
    expect_value(row(saved, PROFILE, REQUIRED).required, True)


def test_a_blank_list_takes_every_required_mark_off_and_keeps_the_skills(saved):
    saved.expect_success(f"profile save {PROFILE} --required-skills ''", actor=saved.user)
    saved.expect_rows(row(saved, PROFILE, REQUIRED).required is False, row(saved, PROFILE, REQUIRED).listed is True)


def test_a_profile_on_the_skills_of_its_type_can_require_one_of_them(person):
    person.expect_success(f"{SAVE} --required-skills journal-tasks", actor=person.user)
    expect_value(row(person, PROFILE, "journal-tasks").required, True)


def test_the_mark_is_kept_in_the_profile_file_over_a_restart(saved):
    expect_value(saved.container.get(ProfileFiles).row(PROFILE).required_skills, tuple([REQUIRED]))


def test_a_shipped_profile_keeps_a_required_mark_a_person_set_and_shows_it_changed(person):
    person.expect_success(f"profile save {RESEARCHER_PROFILE.name} --description 'Researches a question' --skills {LISTED} --required-skills {REQUIRED}", actor=person.user)
    profile = person.container.get(ProfileFiles).effective(f"{RESEARCHER_PROFILE.name}")
    person.expect_rows(profile.required_skills == tuple([REQUIRED]), "required_skills" in profile.changed)


def test_a_required_skill_reaches_only_the_agents_of_that_profile(saved, note_taker):
    researcher = started_helper(saved, "s-researcher", f"{RESEARCHER_PROFILE.name}")
    saved.expect_text("skill required", REQUIRED, actor=note_taker)
    saved.expect_no_text("skill required", REQUIRED, actor=researcher)


def test_a_helper_is_refused_its_tools_until_it_has_read_the_required_skill(saved, note_taker):
    saved.expect_hook_refusal(SESSION, HookSamples.edit("src/cart.py").with_fields(session=SESSION), REQUIRED)


def test_reading_the_required_skill_ends_the_refusal(saved, note_taker):
    read = HookSamples.tool_use("Skill", ToolType.READ, [f".claude/skills/{REQUIRED}/SKILL.md"], None).with_fields(session=SESSION)
    saved.expect_hook_allowed(SESSION, read)
    saved.run_listeners()
    saved.expect_no_text("skill required", REQUIRED, actor=note_taker)


def test_a_worker_of_the_profile_has_the_required_skill_due(person):
    person.expect_success(f'profile save note-worker --type worker --description "Works on notes" --body "Work." --skills {LISTED} --required-skills {REQUIRED}', actor=person.user)
    worker = started_agent(person, "s-worker", "note-worker", CodingHelperRole.WORKER)
    person.expect_text("skill required", REQUIRED, actor=worker)


def test_the_required_skill_is_due_again_after_a_compaction(saved, note_taker):
    saved.hook(SESSION, HookSamples.sample("compact").with_fields(session=SESSION))
    saved.hook(SESSION, HookSamples.session_start().with_fields(session=SESSION))
    saved.run_listeners()
    saved.expect_text("skill required", REQUIRED, actor=note_taker)


def test_a_skill_every_agent_reads_at_the_start_is_locked_on(saved):
    saved.expect_rows(row(saved, PROFILE, "journal").locked is True, row(saved, PROFILE, "journal").listed is True, row(saved, PROFILE, REQUIRED).locked is False)
