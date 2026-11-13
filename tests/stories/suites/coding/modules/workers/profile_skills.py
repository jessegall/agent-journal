import json

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from suites.coding.support.shipped_profiles import HELPER_PROFILES
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, dispatched_worker, repository_environment
from tests.stories.support.story_checks import expect_value
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

SKILLS_FOLDER = ".claude/skills"
LISTED = "journal,journal-tasks"
MAIN_SKILL = "journal-dumps"


def stored(repository, worker, skill: str) -> bool:
    return (repository.worktree_folder(worker.id) / SKILLS_FOLDER / skill / "SKILL.md").is_file()


def test_a_worker_s_worktree_holds_only_the_skills_of_its_profile(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    repository = repository_environment(story)
    story.expect_success(f'profile save notes-worker --type worker --description "Works through notes" --body "Work through the notes." --skills {LISTED}', actor=story.user)
    worker = dispatched_worker(story, DISPATCH.replace("--model sonnet", "--model sonnet --profile notes-worker"))
    story.expect_rows(stored(repository, worker, "journal-tasks"), not stored(repository, worker, "journal-memory"), not stored(repository, worker, MAIN_SKILL), not stored(repository, worker, "journal-etiquette"))


def test_the_skills_of_a_profile_are_listed_with_the_ones_made_for_its_type_and_a_saved_list_changes_them(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    story.user = Actor(story.new_row_id('actor make user "Ada"'), ActorType.USER)
    story.expect_text(f"profile skills --profile {RESEARCHER_PROFILE.name}", "journal-tasks: on", f"{MAIN_SKILL}: off", actor=story.user)
    story.expect_success(f"profile save {RESEARCHER_PROFILE.name} --description 'Researches a question' --skills {LISTED},{MAIN_SKILL}", actor=story.user)
    story.expect_text(f"profile skills --profile {RESEARCHER_PROFILE.name}", f"{MAIN_SKILL}: on", "journal-memory: off", actor=story.user)


def test_the_etiquette_skill_is_required_of_the_main_agent_only_and_no_helper_profile_lists_it(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    requirements = json.loads(story.run("skill requirements --json").output_text)
    story.expect_rows("journal-etiquette" in requirements["main_agent"], "journal-etiquette" not in requirements["session_start"], "journal-etiquette" not in requirements["after_compaction"],
                      not any("journal-etiquette" in profile.skills for profile in HELPER_PROFILES), detail=str(requirements))


def test_the_merger_profile_carries_the_case_book_skill():
    merger = next(profile for profile in HELPER_PROFILES if profile.name == f"{MERGER_PROFILE.name}")
    expect_value(f"{MERGER_PROFILE.name}" in merger.skills and "journal-workers" in merger.skills, True)
