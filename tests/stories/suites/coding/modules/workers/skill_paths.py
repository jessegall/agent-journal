from datetime import timedelta

import pytest

from core.modules.skills.support.skill_nudges import SKILL_TOOL_USES
from core.modules.skills.support.skill_requirement import SkillRequirement
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.skills.support.skill_samples import PATH
from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment, worker_session
from core.modules.skills.support.start_skills import SESSION_START_KEY


@pytest.mark.parametrize("program,skills_folder", [("claude", ".claude/skills"), ("codex", ".agents/skills")])
def test_a_workers_skill_refusal_names_the_whole_long_folder(new_story, program, skills_folder):
    story = new_story(f"{PATH}:LongPathSkillsModule", fixture=OpenTaskOrchestrator)
    repository = repository_environment(story)
    worker = dispatched_worker(story)
    session = worker_session(story, worker)
    story.expect_success(f"setting make {SESSION_START_KEY} '[]'")
    story.container.get(SkillRequirement).is_required = True
    story.hook(session, HookSamples.session_start().with_fields(program=program, launch=session))
    folder = "journal-commandments-plain-code-words-and-the-architecture-of-process-reader-requests"
    story.expect_success(f"skill require {worker.id} {folder}")
    expected = repository.worktree_folder(worker.id) / skills_folder / folder / "SKILL.md"
    instruction = f"read this first: {expected}" if program == "codex" else f"load this first with the Skill tool: {folder}"
    story.run_listeners()
    for _ in range(SKILL_TOOL_USES + 1):
        story.advance(timedelta(seconds=1))
        story.hook(session, HookSamples.edit("cart.py").with_fields(program=program))
    story.expect_hook_refusal(session, HookSamples.edit("cart.py").with_fields(program=program), instruction)
