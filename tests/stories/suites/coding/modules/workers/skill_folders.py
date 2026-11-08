import pytest
from core.modules.skills.support.skill_requirement import SkillRequirement
from core.testing.hook_samples import HookSamples
from server.booting_work import BootingWork
from tests.stories.core.modules.plugins.support.plugin_samples import sample_plugin_folder
from tests.stories.core.base.upgrade.support.fixture_upgrade import upgraded_story
from tests.stories.core.modules.skills.due import use_up_countdown as exhaust_countdown
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session

PROGRAM_FOLDERS = (".claude/skills", ".agents/skills")


def test_preparing_a_worker_publishes_journal_and_plugin_skills_for_both_programs(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    story.expect_success(f"plugin install {sample_plugin_folder(story.home.folder.parent)} --yes")
    worker = dispatched_worker(story)
    folder = repository.worktree_folder(worker.id)
    for program_folder in PROGRAM_FOLDERS:
        story.expect_rows((folder / program_folder / "journal" / "SKILL.md").is_file(),
                          (folder / program_folder / "sample-rules" / "SKILL.md").is_file())
        repository.expect_excluded(worker.id, program_folder)


@pytest.mark.real_git
def test_a_restart_updates_worktrees_and_removes_obsolete_journal_skills(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    folder = repository.worktree_folder(worker.id)
    stale = folder / ".agents/skills/journal/SKILL.md"
    stale.parent.mkdir(parents=True, exist_ok=True)
    stale.write_text("outdated")
    obsolete = folder / ".claude/skills/journal-obsolete/SKILL.md"
    obsolete.parent.mkdir(parents=True, exist_ok=True)
    obsolete.write_text("outdated")
    BootingWork().run(story.container)
    story.run_listeners()
    story.expect_rows(stale.read_text() != "outdated", not obsolete.exists())


@pytest.mark.real_git
def test_plugin_changes_reach_worktrees_and_withdraw_skills_when_disabled(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    folder = repository.worktree_folder(worker.id)
    story.expect_success(f"plugin install {sample_plugin_folder(story.home.folder.parent)} --yes")
    for program_folder in PROGRAM_FOLDERS:
        story.expect_rows((folder / program_folder / "sample-rules/SKILL.md").is_file())
    story.expect_success("plugin disable sample")
    for program_folder in PROGRAM_FOLDERS:
        story.expect_rows(not (folder / program_folder / "sample-rules").exists())


def test_a_claude_workers_skill_reminder_names_the_skill_to_load_with_the_skill_tool(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    story.container.get(SkillRequirement).is_required = True
    story.hook(session, HookSamples.session_start())
    story.expect_success(f"skill require {worker.id} journal")
    exhaust_countdown(story, HookSamples.edit("cart.py"), "journal", session)
    story.expect_hook_refusal(session, HookSamples.edit("cart.py"), "load this first with the Skill tool: journal")


def test_a_codex_workers_skill_reminder_names_its_programs_folder_in_its_worktree(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    story.container.get(SkillRequirement).is_required = True
    story.hook(session, HookSamples.session_start().with_fields(program="codex", launch=session))
    story.expect_success(f"skill require {worker.id} journal")
    expected = repository.worktree_folder(worker.id) / ".agents/skills/journal/SKILL.md"
    exhaust_countdown(story, HookSamples.edit("cart.py").with_fields(program="codex"), "journal", session)
    story.expect_hook_refusal(session, HookSamples.edit("cart.py").with_fields(program="codex"), f"read this first: {expected}")


def test_skill_write_removes_old_codex_journal_skills_and_preserves_other_skills(new_story):
    story = new_story(fixture=OrchestratorWithOpenTask)
    for skill in ("journal", "journal-tasks", "my-skill"):
        path = story.home.project_folder / ".codex/skills" / skill / "SKILL.md"
        path.parent.mkdir(parents=True)
        path.write_text("old")
    story.expect_success("skill write")
    story.expect_rows(not (story.home.project_folder / ".codex/skills/journal").exists(),
                      not (story.home.project_folder / ".codex/skills/journal-tasks").exists(),
                      (story.home.project_folder / ".codex/skills/my-skill/SKILL.md").read_text() == "old")


def test_a_completed_upgrade_removes_the_version_four_codex_skill_folders(new_story):
    def old_skills(home):
        path = home.parent / ".codex/skills/journal-tasks/SKILL.md"
        path.parent.mkdir(parents=True)
        path.write_text("version four")

    story = upgraded_story(new_story, prepare=old_skills)
    story.run_listeners()
    story.expect_rows(not (story.home.project_folder / ".codex/skills/journal-tasks").exists())
