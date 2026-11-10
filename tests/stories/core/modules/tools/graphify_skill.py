from pathlib import Path

from engine.provider.managed_hook import ManagedHook
from engine.provider.managed_hooks import ManagedHooks
from core.testing.hook_samples import HookSamples
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.core.modules.tools.graphify_searches import graphify_enabled
from tests.stories.core.support.fixtures import UserJoined

__all__ = ["graphify_enabled"]

SKILL = Path("src/core/modules/tools/skills/journal-graphify/SKILL.md")
GUARD_COMMAND = "graphify hook-guard search"
CHECK_COMMAND = "/Users/someone/.local/bin/graphify hook-check"
SESSION = "s-graphify"


def managed_hook(command: str, hook_id: str) -> ManagedHook:
    return ManagedHook(hook_id, "claude", "PreToolUse", "Bash|Grep", command, 10, ".claude/settings.json", False)


def managed_commands(story) -> list[str]:
    return [hook.command for hook in story.container.get(ManagedHooks).all()]


def started_agent(story):
    agent = hook_agent(story, story.hook(SESSION, HookSamples.session_start()))
    story.run_listeners()
    return agent


def test_with_graphify_off_no_agent_must_load_the_graphify_skill(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success("tool list", actor=story.user)
    story.expect_no_text("skill required", "journal-graphify", actor=started_agent(story))


def test_the_skill_teaches_names_instead_of_questions_and_the_order_of_the_commands():
    text = SKILL.read_text()
    for needed in ("graphify query", "graphify explain", "graphify path", "2 to 4 names", "Not this"):
        assert needed in text, needed


def test_a_session_start_also_removes_graphifys_check_hook_that_adds_a_line_to_every_tool_use(graphify_enabled):
    story = graphify_enabled
    story.container.get(ManagedHooks).added([managed_hook(CHECK_COMMAND, "check"), managed_hook("other-project-hook", "other")])
    story.hook(SESSION, HookSamples.session_start())
    story.run_listeners()
    commands = managed_commands(story)
    story.expect_rows(CHECK_COMMAND not in commands, "other-project-hook" in commands, detail=str(commands))
