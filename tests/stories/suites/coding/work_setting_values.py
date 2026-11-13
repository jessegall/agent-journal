import json
import shlex

import pytest

from suites.coding.modules.workers.support.work_catalogue import EDITABLE_KEYS
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.suites.coding.modules.workers.support.work_setting_stories import apply_work_setting
from tests.stories.suites.coding.work_settings import shown_fields
from core.modules.helpers.support.helper_settings import COLD_SESSION_CONTEXT_PERCENT
from core.modules.helpers.support.helper_settings import COLD_SESSION_MINUTES
from core.modules.settings.bindings.support.context_share import CONTEXT_LIMIT_KINDS
from core.modules.settings.bindings.support.context_share import CONTEXT_LIMIT_PROFILES
from core.modules.settings.bindings.support.context_share import CONTEXT_LIMIT_TOKENS
from suites.coding.support.shipped_profiles import WORKER_PROFILE


BADGES = {f"{CONTEXT_LIMIT_TOKENS}": "Capped amount"}
FIRST_VALUES = {f"{COLD_SESSION_MINUTES}": 55, f"{COLD_SESSION_CONTEXT_PERCENT}": 20}
ADDED_ENTRIES = {f"{CONTEXT_LIMIT_KINDS}": "worker:200000", f"{CONTEXT_LIMIT_PROFILES}": f"{WORKER_PROFILE.name}:200000",
                 "journal.suites.coding.workers.merge-hooks": f"{WORKER_PROFILE.name}: echo merged"}


def changed_value(field: dict[str, object]) -> object:
    """Another value the setting takes: the opposite of a switch, another of its choices, or the next number."""
    value = field["value"]
    if isinstance(value, bool):
        return not value
    choices = [choice for choice in field.get("choices") or [] if choice != value]
    if choices:
        return choices[0]
    if isinstance(value, list):
        return [*value, ADDED_ENTRIES[str(field["key"])]]
    return value + 1


def stored_text(value: object) -> str:
    return ", ".join(value) if isinstance(value, list) else str(value)


@pytest.mark.parametrize("key", EDITABLE_KEYS)
def test_each_setting_of_the_workers_screen_shows_its_badge_and_a_person_changes_it_and_the_new_value_holds(new_story, key):
    story = new_story(fixture=UserBuilder)
    field = shown_fields(story)[key]
    changed = changed_value(field)
    apply_work_setting(story, key, shlex.quote(json.dumps(changed)) if isinstance(changed, (bool, list)) else changed)
    shown = shown_fields(story)[key]
    stored = story.run(f"setting show {key} --environment main", actor=story.user).output_text
    story.expect_rows(field["badge"] == BADGES.get(key, ""), field["value"] == FIRST_VALUES.get(key, field["value"]), shown["value"] == changed, f"value: {stored_text(changed)}".lower() in stored.lower(),
                      detail=f"{field} | {shown} | {stored}")
