import json

from core.modules.settings.models.setting import Setting
from engine.testing.stories.story import Story
from tests.stories.fixtures.unsupported_settings import UNSUPPORTED_SETTINGS

EXPLANATION_TERMS = {
    "features.checks": ("modules", "suite"),
    "features.sequences": ("modules", "suite"),
    "features.sharing": ("modules", "suite"),
    "features.templates": ("modules", "suite"),
    "features.triggers": ("modules", "suite"),
    "plans.test_commands": ("proof", "--test"),
    "workers.builder_may_queue": ("queue", "permission"),
    "workers.mode": ("person", "environment", "driver choose"),
    "workers.test_command": ("proof", "--test"),
    "workers.test_command_proof": ("argument", "command", "--test"),
}


def expect_unsupported_settings_report(story: Story) -> None:
    stored_keys = {row.key for row in story.story_rows(Setting)}
    for key, value in UNSUPPORTED_SETTINGS:
        line = next((line for line in story.upgrade_text.splitlines() if f"the key {key} (value {json.dumps(value)})" in line), "")
        assert line and "dropped" in line, (key, line)
        assert all(term in line for term in EXPLANATION_TERMS[key]), (key, line)
        assert key not in stored_keys, key
