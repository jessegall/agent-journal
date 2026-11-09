import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.journal_home import LAUNCHER_SOCKET
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import DISPATCH, repository_environment, worker_session
from core.testing.fake_launcher import FakeLauncher


@pytest.mark.parametrize("program,model,skills_folder", [("claude", "sonnet", ".claude/skills"), ("codex", "gpt-6.1-terra", ".agents/skills")])
def test_a_dispatch_with_the_launcher_running_hands_it_the_worker_to_start_in_its_worktree(new_story, program, model, skills_folder):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    launcher = FakeLauncher(story.home.socket(LAUNCHER_SOCKET)).serve()
    worker_id = story.new_row_id(f"worker dispatch --test-command python=pytest --program {program} --model {model} 1", actor=story.agent)
    story.run_listeners()
    launcher.expect_started(worker_id, worker_session(story, Actor(worker_id, ActorType.AGENT)), repository.worktree_folder(worker_id))
    command = launcher.requests[0]["command"]
    brief = " ".join(command)
    for skill in ("journal", "journal-etiquette", "journal-tasks", "journal-shell", "journal-workers"):
        expected = f"load this first with the Skill tool: {skill}" if program == "claude" else f"read this first: {repository.worktree_folder(worker_id) / skills_folder / skill / 'SKILL.md'}"
        story.expect_rows(expected in brief)
    story.expect_rows("Load these skills before your first write" in brief, "journal overview" in brief,
                      "only your new tests or the tests your change affects" in brief, "no Monitor" in brief)


def test_a_dispatch_with_no_launcher_prints_the_command_line_that_starts_the_worker(new_story):
    story = new_story(fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    story.expect_text(DISPATCH, "start the worker with: cd ", str(repository.folder / ".journal" / "worktrees" / "main"), actor=story.agent)

