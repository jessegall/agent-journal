import ast
import importlib
import inspect
import typing
from enum import StrEnum
from pathlib import Path
from types import UnionType

ROOT = Path(__file__).resolve().parents[2]
SOURCE_FOLDERS = ["src/core", "src/suites", "src/server", "src/install"]
SKIPPED_FOLDERS = {"__pycache__", "web"}


def source_files() -> list[Path]:
    return [path for folder in SOURCE_FOLDERS for path in sorted((ROOT / folder).rglob("*.py")) if not SKIPPED_FOLDERS & set(path.parts)]


def source_classes() -> list[type]:
    classes = []
    for path in source_files():
        module = importlib.import_module(".".join(path.relative_to(ROOT / "src").with_suffix("").parts))
        classes += [cls for _, cls in inspect.getmembers(module, inspect.isclass) if cls.__module__ == module.__name__]
    return classes


def is_enum_type(annotation: object) -> bool:
    if typing.get_origin(annotation) is typing.ClassVar:
        return any(is_enum_type(argument) for argument in typing.get_args(annotation))
    if typing.get_origin(annotation) in (typing.Union, UnionType):
        arguments = [argument for argument in typing.get_args(annotation) if argument is not type(None)]
        return bool(arguments) and all(is_enum_type(argument) for argument in arguments)
    return inspect.isclass(annotation) and issubclass(annotation, StrEnum)


def annotations(cls: type) -> dict[str, object]:
    try:
        return typing.get_type_hints(cls)
    except Exception:
        return {}


def raw_class_values(classes: list[type]) -> list[str]:
    return [f"{cls.__module__}.{cls.__name__}.{name} is the string {value!r}, not a member of its enum" for cls in classes
            for name, annotation in annotations(cls).items() if is_enum_type(annotation)
            for value in [cls.__dict__.get(name)] if isinstance(value, str) and not isinstance(value, StrEnum)]


def unambiguous_enum_fields(classes: list[type]) -> set[str]:
    hints = [(name, annotation) for cls in classes for name, annotation in annotations(cls).items()]
    return {name for name, annotation in hints if is_enum_type(annotation)} - {name for name, annotation in hints if not is_enum_type(annotation)}


def is_text(node: ast.AST) -> bool:
    if isinstance(node, ast.Constant):
        return isinstance(node.value, str)
    return isinstance(node, (ast.Tuple, ast.List, ast.Set)) and any(is_text(item) for item in node.elts)


def raw_comparisons(fields: set[str]) -> list[str]:
    places = []
    for path in source_files():
        for node in ast.walk(ast.parse(path.read_text())):
            if isinstance(node, ast.Compare):
                sides = [node.left, *node.comparators]
                if any(isinstance(side, ast.Attribute) and side.attr in fields for side in sides) and any(is_text(side) for side in sides):
                    places.append(f"{path.relative_to(ROOT)}:{node.lineno} compares an enum field with a string")
    return places


def test_no_class_sets_an_enum_field_to_a_raw_string():
    assert raw_class_values(source_classes()) == []


def test_no_enum_field_is_compared_with_a_raw_string():
    assert raw_comparisons(unambiguous_enum_fields(source_classes())) == []
