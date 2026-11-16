from pathlib import Path

from engine.provider.managed_hook import ManagedHook
from engine.provider.managed_hooks import ManagedHooks
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.suites.coding.graphify_searches import graphify_enabled
from tests.stories.support.story_checks import expect_value_with

__all__ = ["graphify_enabled"]
SKILL = Path("src/suites/coding/skills/journal-graphify/SKILL.md")
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


def test_the_skill_teaches_names_instead_of_questions_and_the_order_of_the_commands():
    text = SKILL.read_text()
    for needed in ("graphify query", "graphify explain", "graphify path", "2 to 4 names", "Not this"):
        expect_value_with(text, needed)
