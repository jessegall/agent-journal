"""Writes or checks the pinned contract of the engine: every public class of the contract areas with its bases, its
fields and its methods' signatures, under the engine version it was pinned at. python3 scripts/engine_contract.py
writes tests/snapshots/engine_contract.json."""

import ast
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = ROOT / "src" / "engine"
CONTRACT_FILE = ROOT / "tests" / "snapshots" / "engine_contract.json"
CONTRACT_USE = re.compile(r"use = AreaUse\.CONTRACT\b")


def contract_areas() -> list[Path]:
    return sorted(folder for folder in ENGINE.iterdir() if folder.is_dir() and any(CONTRACT_USE.search(marker.read_text()) for marker in folder.glob("*_area.py")))


def signature(function: ast.FunctionDef | ast.AsyncFunctionDef) -> str:
    arguments = [argument.arg + (f": {ast.unparse(argument.annotation)}" if argument.annotation else "") for argument in function.args.args]
    returned = f" -> {ast.unparse(function.returns)}" if function.returns else ""
    return f"{function.name}({', '.join(arguments)}){returned}"


def class_contract(node: ast.ClassDef) -> dict[str, list[str]]:
    fields = [ast.unparse(item.target) + f": {ast.unparse(item.annotation)}" for item in node.body if isinstance(item, ast.AnnAssign) and not ast.unparse(item.target).startswith("_")]
    methods = [signature(item) for item in node.body if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef)) and not item.name.startswith("_")]
    return {"bases": [ast.unparse(base) for base in node.bases], "fields": fields, "methods": methods}


def contract() -> dict[str, dict[str, list[str]]]:
    classes: dict[str, dict[str, list[str]]] = {}
    for area in contract_areas():
        for file in sorted(area.rglob("*.py")):
            for node in ast.parse(file.read_text()).body:
                if isinstance(node, ast.ClassDef) and not node.name.startswith("_"):
                    classes[f"{file.relative_to(ENGINE).with_suffix('').as_posix().replace('/', '.')}.{node.name}"] = class_contract(node)
    return classes


def engine_version() -> str:
    return re.search(r"ENGINE_VERSION = \((\d+), (\d+), (\d+)\)", (ENGINE / "version" / "version.py").read_text()).expand(r"\1.\2.\3")


# What the version must do for the live contract against the pinned one: a removed or changed class, field or
# signature needs a new major number, an addition a new minor number; None when the version moved enough.
def needed_move(pinned: dict[str, dict[str, list[str]]], live: dict[str, dict[str, list[str]]], pinned_version: str, version: str) -> str | None:
    old, new = (tuple(int(part) for part in text.split(".")) for text in (pinned_version, version))
    removed = [name for name, entry in pinned.items() if name not in live or any(item not in live[name][part] for part, items in entry.items() for item in items)]
    added = [name for name, entry in live.items() if name not in pinned or any(item not in pinned[name][part] for part, items in entry.items() for item in items)]
    if removed and new[0] <= old[0]:
        return f"the engine's contract lost or changed {len(removed)} classes, such as {removed[0]}: raise the major number of ENGINE_VERSION and run scripts/engine_contract.py"
    if added and not removed and new[:2] <= old[:2]:
        return f"the engine's contract gained {len(added)} classes or members, such as {added[0]}: raise the minor number of ENGINE_VERSION and run scripts/engine_contract.py"
    return None


def written() -> dict[str, object]:
    return {"engine_version": engine_version(), "classes": contract()}


if __name__ == "__main__":
    CONTRACT_FILE.write_text(json.dumps(written(), indent=2, sort_keys=True) + "\n")
    sys.stdout.write(f"{len(written()['classes'])} public classes pinned at engine {engine_version()}\n")
