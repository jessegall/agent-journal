from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
SAMPLES = ROOT / ".commandments" / "custom" / "samples" / "layout"
RULES = (
    "architecture_layout_base_loose_class", "architecture_layout_base_loose_function", "architecture_layout_base_loose_value",
    "architecture_layout_top_loose_class", "architecture_layout_top_loose_function", "architecture_layout_top_loose_value",
    "architecture_layout_error_outside_errors", "architecture_layout_enum_outside_enums", "architecture_layout_wrong_sort_in_kind_folder",
)


def sample_text():
    return "\n".join(path.read_text() for path in sorted(SAMPLES.rglob("*.py")))


@pytest.mark.parametrize("rule", RULES)
def test_a_layout_rule_has_a_refused_sample_and_an_accepted_sample(rule):
    text = sample_text()
    assert f"@sin {rule}\n" in text and f"@righteous {rule}\n" in text
