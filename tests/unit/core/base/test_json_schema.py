import pytest

from core.base.json_pointer import JsonPointer
from core.base.json_schema import JsonSchema
from core.base.refusal import Refusal

SCHEMA = JsonSchema({
    "$defs": {"path": {"type": "string", "minLength": 1, "pattern": "^[a-z]"}},
    "type": "object",
    "required": ["level"],
    "additionalProperties": False,
    "properties": {
        "level": {"type": "integer", "minimum": 1},
        "mode": {"enum": ["strict", "loose"]},
        "kind": {"const": "rules"},
        "paths": {"type": "array", "uniqueItems": True, "items": {"$ref": "#/$defs/path"}},
        "limits": {"type": "object", "propertyNames": {"pattern": "^[a-z]+$"}, "additionalProperties": {"type": "integer"}},
        "either": {"anyOf": [{"type": "string"}, {"type": "null"}]},
        "step": {"type": "object", "minProperties": 1, "maxProperties": 1},
    },
})


def test_a_document_that_fits_has_no_problems():
    assert SCHEMA.problems({"level": 2, "mode": "strict", "kind": "rules", "paths": ["src"], "limits": {"files": 3}, "either": None}) == []


@pytest.mark.parametrize("document,problem", [
    ({}, "/level: is required"),
    ({"level": "high"}, "/level: is not of type integer"),
    ({"level": 0}, "/level: is below 1"),
    ({"level": 1, "mode": "odd"}, "/mode: is not one of"),
    ({"level": 1, "kind": "other"}, "/kind: must be 'rules'"),
    ({"level": 1, "paths": [""]}, "/paths/0: is shorter than 1 characters"),
    ({"level": 1, "paths": ["Src"]}, "/paths/0: does not match"),
    ({"level": 1, "paths": ["src", "src"]}, "/paths/1: repeats an earlier item"),
    ({"level": 1, "limits": {"Files": 3}}, "/limits/Files: does not match"),
    ({"level": 1, "limits": {"files": "many"}}, "/limits/files: is not of type integer"),
    ({"level": 1, "either": 3}, "/either: matches none of the allowed forms"),
    ({"level": 1, "colour": "red"}, "/colour: nothing is allowed here"),
    ({"level": 1, "step": {}}, "/step: has fewer than 1 keys"),
    ({"level": 1, "step": {"judges": ["tests"], "skips": []}}, "/step: has more than 1 keys"),
])
def test_each_keyword_names_the_place_that_breaks_it(document, problem):
    assert any(found.startswith(problem) for found in SCHEMA.problems(document)), SCHEMA.problems(document)


def test_a_keyword_the_journal_does_not_check_refuses_the_schema():
    with pytest.raises(Refusal, match="oneOf"):
        JsonSchema({"oneOf": [{"type": "string"}]}).problems("x")


def test_a_pointer_sets_a_value_and_differences_name_each_changed_place():
    changed = JsonPointer.with_value({"level": 1, "paths": ["src"]}, "/paths/-", "tests")
    assert changed == {"level": 1, "paths": ["src", "tests"]}
    assert JsonPointer.differences({"level": 1, "paths": ["src"]}, {"level": 2, "paths": ["src"], "mode": "strict"}) == ["/level", "/mode"]
    with pytest.raises(Refusal, match="names no place"):
        JsonPointer.with_value({"level": 1}, "/limits/files", 3)
