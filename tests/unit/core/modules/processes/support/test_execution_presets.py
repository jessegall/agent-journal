import pytest

from engine.errors.refusal import Refusal
from core.modules.processes.support.execution_presets import ExecutionPresets


def test_medium_on_eight_cores_is_the_default():
    assert ExecutionPresets(lambda: 8).preset("medium").capacities(8) == (24, 12, 8)


def test_small_has_lower_capacities_than_large():
    presets = ExecutionPresets(lambda: 8)
    small, large = presets.preset("small").capacities(8), presets.preset("large").capacities(8)
    assert all(low < high for low, high in zip(small, large))


def test_unknown_preset_lists_the_valid_names():
    with pytest.raises(Refusal, match="huge is no preset"):
        ExecutionPresets(lambda: 8).preset("huge")
