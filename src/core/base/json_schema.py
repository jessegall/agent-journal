import re
from collections.abc import Callable, Mapping, Sequence
from dataclasses import dataclass

from core.base.refusal import Refusal
from core.base.type_guards import is_list, is_mapping

DEFINITIONS = "$defs"
REFERENCE_PREFIX = "#/$defs/"
IGNORED_KEYWORDS = frozenset(("title", "description", "$schema", "default", "examples", "$comment", DEFINITIONS))
TYPE_CHECKS: Mapping[str, Callable[[object], bool]] = {
    "object": is_mapping,
    "array": is_list,
    "string": lambda value: isinstance(value, str),
    "integer": lambda value: isinstance(value, int) and not isinstance(value, bool),
    "number": lambda value: isinstance(value, (int, float)) and not isinstance(value, bool),
    "boolean": lambda value: isinstance(value, bool),
    "null": lambda value: value is None,
}


@dataclass(frozen=True)
class JsonSchema:
    """A JSON schema, checked against a document with the keywords a plugin's config schema uses: a keyword it
    does not know refuses the schema, so a rule is never skipped without saying so. Each problem names the
    place in the document as a JSON pointer."""

    document: Mapping[str, object]

    def problems(self, value: object) -> list[str]:
        return self.checked(self.document, value, "")

    def checked(self, schema: object, value: object, pointer: str) -> list[str]:
        if schema is True:
            return []
        if schema is False:
            return [f"{pointer or '/'}: nothing is allowed here"]
        if not is_mapping(schema):
            raise Refusal(f"the schema at {pointer or '/'} is not an object", "fix the plugin's schema file")
        unknown = set(schema) - set(KEYWORDS) - IGNORED_KEYWORDS
        if unknown:
            raise Refusal(f"the schema uses {', '.join(sorted(unknown))}, which the journal does not check", "use the keywords the journal checks, listed in docs/writing-a-plugin.md")
        return [problem for keyword, rule in schema.items() if keyword in KEYWORDS for problem in KEYWORDS[keyword](self, rule, schema, value, pointer)]

    def reference(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        name = str(rule).removeprefix(REFERENCE_PREFIX)
        definitions = self.document[DEFINITIONS] if DEFINITIONS in self.document else {}
        if not str(rule).startswith(REFERENCE_PREFIX) or not is_mapping(definitions) or name not in definitions:
            raise Refusal(f"the schema refers to {rule}, which it does not define", "refer to a definition under $defs")
        return self.checked(definitions[name], value, pointer)

    def type_rule(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        names = [str(name) for name in rule] if is_list(rule) else [str(rule)]
        if any(TYPE_CHECKS[name](value) for name in names if name in TYPE_CHECKS):
            return []
        return [f"{pointer or '/'}: is not of type {' or '.join(names)}"]

    def properties(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        if not is_mapping(value) or not is_mapping(rule):
            return []
        return [problem for name, inner in rule.items() if name in value for problem in self.checked(inner, value[name], f"{pointer}/{name}")]

    def required(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        if not is_mapping(value) or not is_list(rule):
            return []
        return [f"{pointer}/{name}: is required" for name in rule if name not in value]

    def additional_properties(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        if not is_mapping(value):
            return []
        declared = schema["properties"] if "properties" in schema and is_mapping(schema["properties"]) else {}
        return [problem for name, inner in value.items() if name not in declared for problem in self.checked(rule, inner, f"{pointer}/{name}")]

    def items(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        if not is_list(value):
            return []
        return [problem for number, inner in enumerate(value) for problem in self.checked(rule, inner, f"{pointer}/{number}")]

    def enum(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        if is_list(rule) and value in rule:
            return []
        return [f"{pointer or '/'}: is not one of {rule}"]

    def const(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        return [] if value == rule else [f"{pointer or '/'}: must be {rule!r}"]

    def any_of(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        choices: Sequence[object] = rule if is_list(rule) else []
        if any(not self.checked(choice, value, pointer) for choice in choices):
            return []
        return [f"{pointer or '/'}: matches none of the allowed forms"]

    def min_length(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        if not isinstance(value, str) or not isinstance(rule, int) or len(value) >= rule:
            return []
        return [f"{pointer or '/'}: is shorter than {rule} characters"]

    def minimum(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        if not TYPE_CHECKS["number"](value) or not isinstance(rule, (int, float)) or value >= rule:
            return []
        return [f"{pointer or '/'}: is below {rule}"]

    def min_properties(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        if not is_mapping(value) or not isinstance(rule, int) or len(value) >= rule:
            return []
        return [f"{pointer or '/'}: has fewer than {rule} keys"]

    def max_properties(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        if not is_mapping(value) or not isinstance(rule, int) or len(value) <= rule:
            return []
        return [f"{pointer or '/'}: has more than {rule} keys"]

    def pattern(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        if not isinstance(value, str) or re.search(str(rule), value):
            return []
        return [f"{pointer or '/'}: does not match {rule}"]

    def property_names(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        if not is_mapping(value):
            return []
        return [f"{pointer}/{name}: {problem.partition(': ')[2]} (as a name)" for name in value for problem in self.checked(rule, name, f"{pointer}/{name}")]

    def unique_items(self, rule: object, schema: Mapping[str, object], value: object, pointer: str) -> list[str]:
        if rule is not True or not is_list(value):
            return []
        return [f"{pointer}/{number}: repeats an earlier item" for number, item in enumerate(value) if item in value[:number]]


KEYWORDS: Mapping[str, Callable[[JsonSchema, object, Mapping[str, object], object, str], list[str]]] = {
    "$ref": JsonSchema.reference, "type": JsonSchema.type_rule, "properties": JsonSchema.properties, "required": JsonSchema.required,
    "additionalProperties": JsonSchema.additional_properties, "items": JsonSchema.items, "enum": JsonSchema.enum, "const": JsonSchema.const,
    "anyOf": JsonSchema.any_of, "minLength": JsonSchema.min_length, "minimum": JsonSchema.minimum, "pattern": JsonSchema.pattern,
    "propertyNames": JsonSchema.property_names, "uniqueItems": JsonSchema.unique_items, "minProperties": JsonSchema.min_properties,
    "maxProperties": JsonSchema.max_properties,
}
