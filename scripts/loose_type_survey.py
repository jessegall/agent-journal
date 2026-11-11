"""Prints, as Markdown, every class attribute, dataclass field and constructor parameter in src/engine, src/core and
src/suites whose type promises no contract (bare type, type | None, object, Any or a bare Callable), with the methods
the code calls on it. Run it to renew the loose type survey report; --lines prints one line per finding instead."""

import ast
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOOSE_TYPE = re.compile(r"^(?:ClassVar\[)?(?:type|object|Any|Callable|Callable\[\.\.\., *(?:Any|object)\])(?: \| None)?\]?$")
FOLDERS = ("src/engine", "src/core", "src/suites")


def tracked_files() -> list[Path]:
    listed = subprocess.run(["git", "ls-files", *FOLDERS], capture_output=True, text=True, cwd=ROOT, check=True).stdout.splitlines()
    return [Path(line) for line in listed if line.endswith(".py")]


class LooseTypeSurvey:
    """Finds the names typed with no contract and the methods called on them across the source."""

    def __init__(self) -> None:
        self.trees = {path: ast.parse((ROOT / path).read_text()) for path in tracked_files()}

    def loose_names(self) -> list[tuple[Path, int, str, str, str]]:
        found = []
        for path, tree in self.trees.items():
            for owner in (node for node in ast.walk(tree) if isinstance(node, ast.ClassDef)):
                found.extend((path, line, owner.name, name, annotation) for line, name, annotation in self.annotated(owner) if LOOSE_TYPE.match(annotation))
        return sorted(found)

    @staticmethod
    def annotated(owner: ast.ClassDef) -> list[tuple[int, str, str]]:
        fields = [(node.lineno, node.target.id, ast.unparse(node.annotation)) for node in owner.body if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name)]
        constructor = next((node for node in owner.body if isinstance(node, ast.FunctionDef) and node.name == "__init__"), None)
        parameters = [] if constructor is None else [(argument.lineno, argument.arg, ast.unparse(argument.annotation)) for argument in constructor.args.args if argument.annotation is not None]
        return fields + parameters

    def called_methods(self) -> dict[str, set[str]]:
        calls: dict[str, set[str]] = defaultdict(set)
        for tree in self.trees.values():
            for node in ast.walk(tree):
                if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Attribute):
                    calls[node.func.value.attr].add(node.func.attr)
        return calls

    def lines(self) -> list[str]:
        return [f"{path}:{line} {owner}.{name}: {annotation}" for path, line, owner, name, annotation in self.loose_names()]

    def markdown(self) -> str:
        found = self.loose_names()
        calls = self.called_methods()
        rows = [f"| {path}:{line} | {owner}.{name} | `{annotation}` | {', '.join(sorted(calls.get(name, set()))) or '-'} |" for path, line, owner, name, annotation in found]
        return "\n".join([f"# Loose types\n\n{len(found)} names are typed with no contract.\n", "| Where | Name | Type | Methods called on it |", "|---|---|---|---|", *rows])


if __name__ == "__main__":
    survey = LooseTypeSurvey()
    print("\n".join(survey.lines()) if "--lines" in sys.argv else survey.markdown())
