from collections.abc import Iterator, Sequence

import pytest

from core.modules.plans.support.plan_settings import PLAN_SETTINGS
from core.modules.updates.models.enums.update_setting import UPDATE_SETTINGS
from engine.setting.setting_group import SettingGroup
from engine.setting.setting_value import SettingValue
from suites.coding.modules.workers.support.worker_settings import WORKER_SETTING_VALUES
from suites.coding.settings.coding_setting_values import CodingSettingValues
from suites.coding.settings.graphify_setting_values import GraphifySettingValues

# Values the journal runs as a command outside an agent's sandbox, or downloads code from.
COMMAND_SUFFIXES = ("command", "commands", "hooks", "address")
CODE_RUNNING_KEYS = {
    "worktree-commands", "merge-commands", "merge-hooks", "merge-build-command", "merger-commands", "preset-test-commands", "affected-tests-command",
    "project-test-command", "graphify-command", "graphify-install-command", "release-address", "command"}


def flattened_values(declared: Sequence[SettingGroup | SettingValue]) -> Iterator[SettingValue]:
    for entry in declared:
        if isinstance(entry, SettingGroup):
            yield from flattened_values(entry.children)
            continue
        yield entry


ALL_VALUES = list(flattened_values([*WORKER_SETTING_VALUES, *CodingSettingValues.values, *GraphifySettingValues.nodes(), *UPDATE_SETTINGS, *PLAN_SETTINGS]))


@pytest.mark.parametrize("key", sorted(CODE_RUNNING_KEYS))
def test_a_setting_whose_value_runs_as_a_command_or_downloads_code_is_set_by_a_person(key):
    declared = [value for value in ALL_VALUES if value.key == key]
    assert declared and all(value.person_set for value in declared)


def test_every_setting_named_for_a_command_or_an_address_is_set_by_a_person():
    matching = [value for value in ALL_VALUES if value.key.rsplit("-", 1)[-1] in COMMAND_SUFFIXES]
    assert matching and [value.key for value in matching if not value.person_set] == []
