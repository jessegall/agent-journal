"""Finds the story commands that name the environment their story already runs in, and, with --sweep, takes the flag out.

A story names its environment once, at new_story(environment="main"), and the story engine gives every command it runs that flag
unless the command names another. So a command that spells out the story's own environment repeats it. The check lists them and
exits 1 when it finds any. --sweep rewrites the files named after it: in each function that calls new_story and spells out
--environment main in its commands, every new_story call without an environment gets environment="main", and the flag leaves the
commands. A story's fixture class is left alone, since its steps run before the story has an environment."""

import ast
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
STORIES = ROOT / "tests" / "stories"
FLAG = " --environment "
SWEPT_ENVIRONMENT = "main"


@dataclass(frozen=True)
class Flag:
    line: int
    environment: str


def own_environment_flags(source: str) -> list[Flag]:
    """The commands in functions that call new_story with an environment, naming that same environment."""
    found = []
    for function in functions_with_stories(ast.parse(source)):
        for environment in {environment for environment in story_environments(function) if environment is not None}:
            flag = f"--environment {environment}"
            found.extend(Flag(node.lineno, environment) for node in strings_in(function) if flag in node_text(node))
    return found


def swept(source: str) -> str:
    """The source with new_story calls given environment="main" and its commands cleared of the flag, in each function that spells it out."""
    offsets = line_offsets(source)
    data = source.encode()
    edits: list[tuple[int, int, str]] = []
    for function in functions_with_stories(ast.parse(source)):
        flagged = [node for node in strings_in(function) if f"{FLAG}{SWEPT_ENVIRONMENT}" in raw(source, offsets, node)]
        if not flagged or set(story_environments(function)) - {None, SWEPT_ENVIRONMENT}:
            continue
        for call in story_calls(function):
            if not any(keyword.arg == "environment" for keyword in call.keywords):
                end = absolute(offsets, call.end_lineno, call.end_col_offset) - 1
                edits.append((end, end, f'environment="{SWEPT_ENVIRONMENT}"' if not call.args and not call.keywords else f', environment="{SWEPT_ENVIRONMENT}"'))
        for node in flagged:
            start, end = absolute(offsets, node.lineno, node.col_offset), absolute(offsets, node.end_lineno, node.end_col_offset)
            edits.append((start, end, data[start:end].decode().replace(f"{FLAG}{SWEPT_ENVIRONMENT}", "")))
    for start, end, text in sorted(edits, reverse=True):
        data = data[:start] + text.encode() + data[end:]
    return data.decode()


def functions_with_stories(tree: ast.AST) -> list[ast.FunctionDef | ast.AsyncFunctionDef]:
    return [node for node in ast.walk(tree) if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and story_calls(node)]


def story_calls(function: ast.AST) -> list[ast.Call]:
    return [node for node in ast.walk(function) if isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and node.func.id == "new_story"]


def story_environments(function: ast.AST) -> list[str | None]:
    environments: list[str | None] = []
    for call in story_calls(function):
        keyword = next((keyword for keyword in call.keywords if keyword.arg == "environment"), None)
        environments.append(keyword.value.value if keyword is not None and isinstance(keyword.value, ast.Constant) else None)
    return environments


def strings_in(function: ast.AST) -> list[ast.Constant | ast.JoinedStr]:
    """The command lines a function gives its story: the string, an f-string as one, that is the first argument of a story's run, new_row_id
    or expect_ method. A string used any other way, to build or compare, is left as it is."""
    commands = [node.args[0] for node in ast.walk(function) if is_story_command(node) and node.args]
    return [node for node in commands if isinstance(node, ast.JoinedStr) or (isinstance(node, ast.Constant) and isinstance(node.value, str))]


def is_story_command(node: ast.AST) -> bool:
    return isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute) and (node.func.attr in ("run", "new_row_id") or node.func.attr.startswith("expect_"))


def node_text(node: ast.Constant | ast.JoinedStr) -> str:
    return node.value if isinstance(node, ast.Constant) else "".join(part.value for part in node.values if isinstance(part, ast.Constant))


def line_offsets(source: str) -> list[int]:
    offsets, total = [0], 0
    for line in source.splitlines(keepends=True):
        total += len(line.encode())
        offsets.append(total)
    return offsets


def absolute(offsets: list[int], line: int, column: int) -> int:
    return offsets[line - 1] + column


def raw(source: str, offsets: list[int], node: ast.Constant | ast.JoinedStr) -> str:
    return source.encode()[absolute(offsets, node.lineno, node.col_offset):absolute(offsets, node.end_lineno, node.end_col_offset)].decode()


def main(arguments: list[str]) -> int:
    sweeping = "--sweep" in arguments
    paths = [Path(argument) for argument in arguments if argument != "--sweep"] or sorted(STORIES.rglob("*.py"))
    offenders = 0
    for path in paths:
        source = path.read_text()
        if sweeping:
            result = swept(source)
            if result != source:
                path.write_text(result)
                print(f"swept {path}")
            continue
        for flag in own_environment_flags(source):
            offenders += 1
            print(f"{path}:{flag.line} names its story's own environment, {flag.environment}")
    return 1 if offenders else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
