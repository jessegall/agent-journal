"""Rename a name in the core, engine, server and suites packages and the tests, with everything that depends on it.

  .venv/bin/python scripts/refactoring/rename.py Clock Timepiece
  .venv/bin/python scripts/refactoring/rename.py Agents.live current
  .venv/bin/python scripts/refactoring/rename.py engine.text.chain.LEADS CONTROL_KEYWORDS
  .venv/bin/python scripts/refactoring/rename.py src/engine/text/chain.py:Chain.spans.line text
  .venv/bin/python scripts/refactoring/rename.py --list=renames.txt --dry-run

What the old name is decides what is renamed:

- `Class`: the class, every bare use in its module and in the modules that import it, its quoted forward
  references, and its file when the file is named after it, with every dotted module path that names the file.
- `Class.member`: a method, class constant or field of that class and every class it inherits it from or passes
  it to; each use is found by the type mypy gives its receiver, so `x.of(...)` on another class is left alone.
  A use whose receiver mypy cannot type is renamed only when no other class defines a member of that name, and
  is listed either way.
- `module.name`: a function or constant at the top of a module, with every module that imports it.
- `path.py:function.name` or `path.py:Class.method.name`: a parameter or local inside that one function, with
  the keyword arguments of the calls mypy resolves to it.
- `*name`: every parameter and local variable of that name in every function, with the keyword arguments of the
  calls to a function that takes it; fields, module names and attributes are left alone.

A list line is `Old New`, or `Old New # why`; blank lines and lines starting with # are skipped. The new name
is refused when the project's naming rules (.commandments/custom/naming_poetic_* and naming_sentence_*, with
the word lists of lists.json) ban it, or when it already stands where the old one does.
Any number of renames go in one call or one list: all are planned against one reading of the code and written
together, and two that reach the same spot are refused.
After writing, every attribute use of an old name that no class defines any more is listed as unplaced,
to rename by hand. `--dry-run` reports every place without writing; commit before a rename so it can be undone by
going back. `--root=DIR` works on another checkout. Needs mypy in .venv.
"""
import ast
import collections
import glob
import io
import json
import os
import re
import subprocess
import sys
import tokenize
from collections.abc import Iterator
from dataclasses import dataclass, field

from mypy import build
from mypy.modulefinder import BuildSource
from mypy.nodes import FUNC_NO_INFO, AssignmentStmt, CallExpr, ClassDef, Decorator, Expression, FuncDef, MemberExpr, MypyFile, NameExpr, OverloadedFuncDef, Statement, SuperExpr, TypeInfo, Var
from mypy.options import Options
from mypy.server.subexpr import get_subexpressions
from mypy.types import CallableType, Instance, Type, TypeType, UnionType, get_proper_type

RULES = ".commandments/custom"
PACKAGES = ("core", "engine", "server", "suites")
PROJECT_PREFIXES = tuple(f"{package}." for package in (*PACKAGES, "tests"))
LIBRARY_RECEIVERS = {"args", "datetime", "date", "time", "json", "os", "re", "sys", "Path", "subprocess", "threading", "shutil", "socket", "sqlite3", "uuid", "random", "math"}
SELECTORS = {"class": "type-declaration", "method": "function", "member": "identifier", "module": "identifier", "local": "identifier", "parameter": "parameter"}


@dataclass(frozen=True)
class Place:
    """One position in one file where an old name is written and the new one goes."""

    path: str
    line: int
    column: int
    old: str
    new: str
    quoted: bool = False


@dataclass
class Plan:
    """What one rename touches: its places, the files it moves, the uses it could not place, and why it is refused if it is."""

    places: list[Place] = field(default_factory=list[Place])
    moves: list[tuple[str, str]] = field(default_factory=list[tuple[str, str]])
    unplaced: list[str] = field(default_factory=list[str])
    refusals: list[str] = field(default_factory=list[str])
    untyped: list[Place] = field(default_factory=list[Place])
    member: str = ""
    defining_classes: set[str] = field(default_factory=set[str])
    owners: set[str] = field(default_factory=set[str])


def project_files(root: str) -> list[str]:
    sources = [path for package in PACKAGES for path in glob.glob(f"{root}/src/{package}/**/*.py", recursive=True)]
    return sorted(sources) + sorted(glob.glob(f"{root}/tests/**/*.py", recursive=True))


class Project:
    """The packages and their tests as mypy reads them, once per run."""

    def __init__(self, root: str) -> None:
        self.root = root
        self.files = project_files(root)
        options = Options()
        options.export_types = True
        options.ignore_missing_imports = True
        options.check_untyped_defs = True
        options.incremental = False
        options.preserve_asts = True
        options.explicit_package_bases = True
        options.mypy_path = [f"{root}/src", root]
        sources = [BuildSource(path, self.module_name(path), base_dir=self.base_folder(path)) for path in self.files]
        self.build = build.build(sources, options)
        self.types = self.build.types
        self.trees: dict[str, MypyFile] = {state.xpath: state.tree for state in self.build.graph.values() if state.tree is not None and state.xpath in self.files}
        self.expressions = {path: get_subexpressions(tree) for path, tree in self.trees.items()}
        self.sources = {path: read_text(path) for path in self.files}
        self.syntax = {path: ast.parse(source) for path, source in self.sources.items()}
        self.tokens = {path: list(tokenize.generate_tokens(io.StringIO(source).readline)) for path, source in self.sources.items()}

    def module_name(self, path: str) -> str:
        relative = os.path.relpath(path, self.base_folder(path))
        return relative[:-3].replace(os.sep, ".").removesuffix(".__init__")

    def base_folder(self, path: str) -> str:
        return f"{self.root}/src" if path.startswith(f"{self.root}/src/") else self.root

    def classes(self, name: str) -> list[TypeInfo]:
        return [node.info for node in self.class_definitions() if node.fullname == name or node.name == name]

    def class_definitions(self) -> list[ClassDef]:
        return [node for tree in self.trees.values() for node in nested_classes(tree.defs)]

    def defining_file(self, module: str) -> str:
        state = self.build.graph.get(module)
        return state.xpath if state else ""


def nested_classes(statements: list[Statement]) -> Iterator[ClassDef]:
    for statement in statements:
        if isinstance(statement, ClassDef):
            yield statement
            yield from nested_classes(statement.defs.body)


def read_text(path: str) -> str:
    with open(path, encoding="utf-8") as file:
        return file.read()


def file_lines(path: str) -> list[str]:
    return read_text(path).splitlines(keepends=True)


def file_tokens(path: str) -> list[tokenize.TokenInfo]:
    return list(tokenize.generate_tokens(io.StringIO(read_text(path)).readline))


def single_class(type_value: Type | None) -> TypeInfo | None:
    proper = get_proper_type(type_value)
    if isinstance(proper, Instance):
        return proper.type
    if isinstance(proper, TypeType):
        item = get_proper_type(proper.item)
        return item.type if isinstance(item, Instance) else None
    if isinstance(proper, CallableType) and proper.is_type_obj():
        return proper.type_object()
    if isinstance(proper, UnionType):
        candidates = {info for item in proper.items if (info := single_class(item)) is not None and info.fullname != "builtins.None"}
        return candidates.pop() if len(candidates) == 1 else None
    return None


def union_classes(type_value: Type | None) -> list[TypeInfo]:
    proper = get_proper_type(type_value)
    if isinstance(proper, UnionType):
        return [info for item in proper.items if (info := single_class(item)) is not None and info.fullname != "builtins.None"]
    info = single_class(proper)
    return [info] if info is not None else []


def topmost_definer(info: TypeInfo, name: str) -> TypeInfo | None:
    defining = [base for base in info.mro if name in base.names]
    return defining[-1] if defining else None


def tracked_tokens(tokens: list[tokenize.TokenInfo], first: int = 1, last: int = sys.maxsize) -> Iterator[tuple[int, int]]:
    depth = 0
    for index, token in enumerate(tokens):
        if not first <= token.start[0] <= last:
            continue
        if token.type == tokenize.OP and token.string in "([{":
            depth += 1
        elif token.type == tokenize.OP and token.string in ")]}":
            depth -= 1
        yield index, depth


def is_keyword_argument(tokens: list[tokenize.TokenInfo], index: int, depth: int) -> bool:
    return depth > 0 and tokens[index + 1].string == "=" and tokens[index - 1].string in ("(", ",")


class NamingRules:
    """The project's naming rules, read from its custom detectors and their shared word lists."""

    def __init__(self, root: str) -> None:
        folder = f"{root}/{RULES}"
        lists_path = f"{folder}/lists.json"
        self.word_lists: dict[str, list[str]] = json.loads(read_text(lists_path)) if os.path.exists(lists_path) else {}
        self.patterns: dict[str, list[tuple[re.Pattern[str], list[re.Pattern[str]]]]] = collections.defaultdict(list)
        for path in glob.glob(f"{folder}/**/naming_poetic_*.json", recursive=True) + glob.glob(f"{folder}/**/naming_sentence_*.json", recursive=True):
            query = json.loads(read_text(path))["find"]
            matches = [step["nameMatches"] for step in query.get("where", []) if "nameMatches" in step]
            if "select" not in query or not matches:
                continue
            rejects = [self.reject_pattern(step) for step in query.get("reject", [])]
            self.patterns[query["select"]].append((re.compile(self.expanded(matches[0])), [pattern for pattern in rejects if pattern is not None]))

    def expanded(self, pattern: str) -> str:
        return re.sub(r"\$\{(\w+)\}", lambda match: "|".join(re.escape(word) for word in self.word_lists[match.group(1)]), pattern)

    @staticmethod
    def reject_pattern(step: dict[str, object]) -> re.Pattern[str] | None:
        if isinstance(step.get("nameMatches"), str):
            return re.compile(str(step["nameMatches"]))
        if isinstance(step.get("name"), str):
            return re.compile(f"^{re.escape(str(step['name']))}$")
        names = step.get("nameIn")
        if isinstance(names, list):
            return re.compile("^(" + "|".join(re.escape(str(name)) for name in names) + ")$")
        return None

    def refusal(self, name_type: str, name: str) -> str:
        for pattern, rejects in self.patterns[SELECTORS[name_type]]:
            match = pattern.search(name)
            if match and not any(reject.search(name) for reject in rejects):
                return f"{name} is banned by the naming rules ({match.group(0).strip('_')})"
        return ""


class Renamer:
    """Plans each rename against the project as mypy read it, then writes every plan at once."""

    def __init__(self, project: Project, rules: NamingRules) -> None:
        self.project, self.rules = project, rules

    def plan(self, old: str, new: str) -> Plan:
        if old.startswith("*"):
            return self.every_local(old[1:], new)
        if ":" in old:
            return self.local(old, new)
        if "." in old and old.split(".")[0] in (*PACKAGES, "tests"):
            return self.module_level(old, new)
        if "." in old:
            return self.member(old, new)
        return self.class_rename(old, new)

    def class_rename(self, old: str, new: str) -> Plan:
        plan = Plan()
        infos = self.project.classes(old)
        if len(infos) != 1:
            plan.refusals.append(f"{old} names {len(infos)} classes; give its full name, core.module.{old}")
            return plan
        info = infos[0]
        plan.refusals += [refusal for refusal in [self.rules.refusal("class", new)] if refusal]
        if self.project.classes(new):
            plan.refusals.append(f"a class named {new} already stands")
        self.references(info.fullname, info.name, new, plan)
        defining = self.project.build.graph[info.module_name].xpath
        if os.path.basename(defining) == f"{snake_case(info.name)}.py":
            plan.moves.append((defining, os.path.join(os.path.dirname(defining), f"{snake_case(new)}.py")))
        return plan

    def module_level(self, old: str, new: str) -> Plan:
        plan = Plan()
        module, _, name = old.rpartition(".")
        state = self.project.build.graph.get(module)
        if state is None or state.tree is None or name not in state.tree.names:
            plan.refusals.append(f"{module} defines no {name}")
            return plan
        name_type = "method" if isinstance(state.tree.names[name].node, FuncDef) else "module"
        plan.refusals += [refusal for refusal in [self.rules.refusal(name_type, new)] if refusal]
        if new in state.tree.names:
            plan.refusals.append(f"{module} already defines {new}")
        self.references(old, name, new, plan)
        return plan

    def references(self, fullname: str, old: str, new: str, plan: Plan) -> None:
        module = fullname.rpartition(".")[0]
        for path in self.project.files:
            source = self.project.sources[path]
            if path == self.project.defining_file(module) or re.search(rf"from {re.escape(module)} import (\([^)]*|[^\n]*)\b{old}\b", source):
                plan.places += self.bare_places(path, old, new)
                plan.places += self.quoted_places(path, old, new)
        for path, expressions in self.project.expressions.items():
            for node in expressions:
                if isinstance(node, MemberExpr) and node.fullname == fullname and node.end_column is not None and node.end_line is not None:
                    plan.places.append(Place(path, node.end_line, node.end_column - len(old), old, new))

    @staticmethod
    def bare_places(path: str, old: str, new: str) -> list[Place]:
        tokens = file_tokens(path)
        places: list[Place] = []
        for index, depth in tracked_tokens(tokens):
            token = tokens[index]
            if token.type == tokenize.NAME and token.string == old and tokens[index - 1].string != "." and not is_keyword_argument(tokens, index, depth):
                places.append(Place(path, token.start[0], token.start[1], old, new))
        return places

    @staticmethod
    def definition_place(path: str, node: FuncDef | OverloadedFuncDef, old: str, new: str) -> Place:
        text = file_lines(path)[node.line - 1]
        match = re.search(rf"\b(?:def|class)\s+{re.escape(old)}\b", text) or re.search(rf"\b{re.escape(old)}\b", text)
        if match is None:
            raise SystemExit(f"nothing written: {path}:{node.line} holds no {old}")
        column = match.end() - len(old) if match.group(0).startswith(("def", "class")) else match.start()
        return Place(path, node.line, column, old, new)

    @staticmethod
    def quoted_places(path: str, old: str, new: str) -> list[Place]:
        tokens = file_tokens(path)
        return [Place(path, token.start[0], token.start[1] + 1, old, new, quoted=True) for index, token in enumerate(tokens)
                if token.type == tokenize.STRING and token.string in (f'"{old}"', f"'{old}'") and index > 0 and tokens[index - 1].string in ("->", ":", "[", ",", "(")]

    def member(self, old: str, new: str) -> Plan:
        plan = Plan()
        owner, _, name = old.rpartition(".")
        definers = {info.fullname: info for info in (topmost_definer(info, name) for info in self.project.classes(owner)) if info is not None}
        if len(definers) != 1:
            plan.refusals.append(f"{owner} defines no {name}" if not definers else f"{owner} names {len(definers)} classes with a {name}; give the full class name")
            return plan
        group = next(iter(definers.values()))
        plan.member, plan.defining_classes = name, {group.fullname}
        name_type = "method" if isinstance(group.names[name].node, (FuncDef, Decorator, OverloadedFuncDef)) else "member"
        plan.refusals += [refusal for refusal in [self.rules.refusal(name_type, new)] if refusal]
        members = [definition for definition in self.project.class_definitions() if name in definition.info.names and topmost_definer(definition.info, name) is group]
        plan.owners = {definition.info.fullname for definition in members}
        plan.refusals += [f"{definition.info.fullname} already has {new}" for definition in members if new in definition.info.names]
        is_unique = not any(name in definition.info.names and topmost_definer(definition.info, name) is not group for definition in self.project.class_definitions())
        for path, tree in self.project.trees.items():
            for definition in nested_classes(tree.defs):
                if definition in members:
                    plan.places += self.member_definitions(path, definition, name, new)
        for path, expressions in self.project.expressions.items():
            for node in expressions:
                self.member_use(path, node, group, name_type, is_unique, new, plan)
        return plan

    def member_definitions(self, path: str, definition: ClassDef, name: str, new: str) -> list[Place]:
        places: list[Place] = []
        for statement in definition.defs.body:
            target = statement.func if isinstance(statement, Decorator) else statement
            if isinstance(target, (FuncDef, OverloadedFuncDef)) and target.name == name:
                places.append(self.definition_place(path, target, name, new))
            elif isinstance(statement, AssignmentStmt):
                places += [Place(path, lvalue.line, lvalue.column, name, new) for lvalue in statement.lvalues if isinstance(lvalue, NameExpr) and lvalue.name == name]
        return places

    def member_use(self, path: str, node: Expression, group: TypeInfo, name_type: str, is_unique: bool, new: str, plan: Plan) -> None:
        name = plan.member
        if isinstance(node, (MemberExpr, SuperExpr)) and node.name == name and node.end_column is not None and node.end_line is not None:
            receivers = self.receivers(node)
            place = Place(path, node.end_line, node.end_column - len(name), name, new)
            if any(topmost_definer(receiver, name) is group for receiver in receivers):
                plan.places.append(place)
            elif not receivers or all(topmost_definer(receiver, name) is None and receiver.fullname.startswith(PROJECT_PREFIXES) for receiver in receivers):
                plan.unplaced.append(f"{path}:{node.end_line}")
                plan.untyped.append(place)
                if is_unique:
                    plan.places.append(place)
        elif isinstance(node, CallExpr) and name_type == "member" and name in node.arg_names:
            callee = single_class(self.project.types.get(node.callee))
            if callee is not None and topmost_definer(callee, name) is group:
                plan.places += self.keyword_places(path, node, name, new)

    def receivers(self, node: MemberExpr | SuperExpr) -> list[TypeInfo]:
        if isinstance(node, SuperExpr):
            return [node.info] if node.info is not None else []
        typed = union_classes(self.project.types.get(node.expr)) if node.expr in self.project.types else []
        guess = self.guessed_class(node.expr)
        return typed or ([guess] if guess is not None else [])

    def guessed_class(self, receiver: Expression) -> TypeInfo | None:
        if isinstance(receiver, CallExpr) and isinstance(receiver.callee, MemberExpr) and receiver.callee.name == "get" and receiver.args:
            argument = receiver.args[0]
            if isinstance(argument, NameExpr) and isinstance(argument.node, TypeInfo):
                return argument.node
        word = receiver.name if isinstance(receiver, (NameExpr, MemberExpr)) else ""
        matches = [definition.info for definition in self.project.class_definitions() if snake_case(definition.name) == word]
        return matches[0] if len(matches) == 1 else None

    def every_local(self, old: str, new: str) -> Plan:
        plan = Plan()
        plan.refusals += [refusal for refusal in {self.rules.refusal("parameter", new), self.rules.refusal("local", new)} if refusal]
        accepting: set[str] = set()
        scopes: dict[str, list[ast.FunctionDef | ast.AsyncFunctionDef | ast.Lambda]] = {}
        for path in self.project.files:
            tree = self.project.syntax[path]
            functions = [node for node in ast.walk(tree) if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.Lambda))]
            accepting.update(function.name for function in functions if not isinstance(function, ast.Lambda) and any(argument.arg == old for argument in all_arguments(function)))
            accepting.update(node.name for node in ast.walk(tree) if isinstance(node, ast.ClassDef) and any(
                isinstance(method, ast.FunctionDef) and method.name == "__init__" and any(argument.arg == old for argument in method.args.args) for method in node.body))
            scopes[path] = [function for function in functions if self.binds(function, old)]
        for path, functions in scopes.items():
            tokens = self.project.tokens[path]
            outermost = [function for function in functions if not any(
                outer is not function and outer.lineno <= function.lineno and (function.end_lineno or 0) <= (outer.end_lineno or 0) for outer in functions)]
            for function in outermost:
                last = function.end_lineno or function.lineno
                if any(token.type == tokenize.NAME and token.string == new for token in tokens if function.lineno <= token.start[0] <= last):
                    plan.unplaced.append(f"{path}:{function.lineno} already has {new}")
                    continue
                plan.places += self.scoped_places(path, tokens, function.lineno, last, old, new)
        for path in self.project.files:
            if old in self.project.sources[path]:
                plan.places += self.accepting_keywords(self.project.tokens[path], path, accepting, old, new)
        plan.places = sorted(set(plan.places), key=lambda place: (place.path, place.line, place.column))
        return plan

    @staticmethod
    def binds(function: ast.FunctionDef | ast.AsyncFunctionDef | ast.Lambda, name: str) -> bool:
        if any(argument.arg == name for argument in all_arguments(function)):
            return True
        body: list[ast.AST] = list(function.body) if isinstance(function.body, list) else [function.body]
        nodes = [node for statement in body for node in ast.walk(statement)]
        return any(isinstance(node, ast.Name) and node.id == name and isinstance(node.ctx, ast.Store) for node in nodes) or any(
            isinstance(node, ast.ExceptHandler) and node.name == name for node in nodes)

    @staticmethod
    def scoped_places(path: str, tokens: list[tokenize.TokenInfo], first: int, last: int, old: str, new: str) -> list[Place]:
        places: list[Place] = []
        for index, depth in tracked_tokens(tokens, first, last):
            token = tokens[index]
            if token.type != tokenize.NAME or token.string != old or tokens[index - 1].string == ".":
                continue
            is_keyword = is_keyword_argument(tokens, index, depth)
            is_definition = tokens[index - 2].type == tokenize.NAME and tokens[index - 2].string in ("def", "lambda")
            if not is_keyword or is_definition or Renamer.is_signature(tokens, index):
                places.append(Place(path, token.start[0], token.start[1], old, new))
        return places

    @staticmethod
    def is_signature(tokens: list[tokenize.TokenInfo], index: int) -> bool:
        depth = 0
        for position in range(index - 1, -1, -1):
            if tokens[position].string in ")]}":
                depth += 1
            elif tokens[position].string in "([{":
                if depth == 0:
                    return position >= 2 and tokens[position - 2].string == "def"
                depth -= 1
            elif tokens[position].string == "lambda" and depth == 0:
                return True
        return False

    @staticmethod
    def accepting_keywords(tokens: list[tokenize.TokenInfo], path: str, accepting: set[str], old: str, new: str) -> list[Place]:
        places: list[Place] = []
        callees: list[str] = []
        for index, token in enumerate(tokens):
            if token.type == tokenize.OP and token.string in "([{":
                callees.append(tokens[index - 1].string if token.string == "(" and index > 0 and tokens[index - 1].type == tokenize.NAME else "")
            elif token.type == tokenize.OP and token.string in ")]}":
                if callees:
                    callees.pop()
            elif (token.type == tokenize.NAME and token.string == old and callees and callees[-1] in accepting and tokens[index + 1].string == "="
                  and tokens[index - 1].string in ("(", ",") and tokens[index - 3].string != "def"):
                places.append(Place(path, token.start[0], token.start[1], old, new))
        return places

    @staticmethod
    def keyword_places(path: str, call: CallExpr, old: str, new: str) -> list[Place]:
        text = file_lines(path)
        return [Place(path, line, match.start(), old, new) for line in range(call.line, (call.end_line or call.line) + 1)
                for match in re.finditer(rf"(?<![\w.]){re.escape(old)}(?=\s*=[^=])", text[line - 1])]

    def local(self, old: str, new: str) -> Plan:
        plan = Plan()
        path, _, dotted = old.partition(":")
        path = path if path.startswith(self.project.root) else os.path.join(self.project.root, path)
        *owners, name = dotted.split(".")
        function = self.find_function(self.project.trees.get(path), owners)
        if function is None:
            plan.refusals.append(f"{path} has no function {'.'.join(owners)}")
            return plan
        variables = [argument.variable for argument in function.arguments if argument.variable.name == name]
        is_parameter = bool(variables)
        plan.refusals += [refusal for refusal in [self.rules.refusal("parameter" if is_parameter else "local", new)] if refusal]
        names = [node for node in get_subexpressions(function) if isinstance(node, NameExpr)]
        if any(node.name == new for node in names) or any(argument.variable.name == new for argument in function.arguments):
            plan.refusals.append(f"{new} already stands inside {'.'.join(owners)}")
        for node in names:
            if node.name == name and (node.node in variables or isinstance(node.node, Var) and node.node.is_inferred and (not variables or node.node.name == name)):
                plan.places.append(Place(path, node.line, node.column, name, new))
        for argument in function.arguments:
            if argument.variable.name == name:
                text = file_lines(path)[argument.line - 1]
                column = argument.column if text[argument.column:argument.column + len(name)] == name else text.index(name, argument.column)
                plan.places.append(Place(path, argument.line, column, name, new))
        if is_parameter:
            for other_path, expressions in self.project.expressions.items():
                plan.places += [place for node in expressions if isinstance(node, CallExpr) and name in node.arg_names and self.calls(node, function)
                                for place in self.keyword_places(other_path, node, name, new)]
        plan.places = sorted(set(plan.places), key=lambda place: (place.path, place.line, place.column))
        return plan

    def calls(self, call: CallExpr, function: FuncDef) -> bool:
        callee = call.callee
        if isinstance(callee, MemberExpr) and callee.expr in self.project.types:
            info = single_class(self.project.types[callee.expr])
            return info is not None and function.info is not FUNC_NO_INFO and info.has_base(function.info.fullname) and callee.name == function.name
        return isinstance(callee, NameExpr) and callee.node is function

    @staticmethod
    def find_function(tree: MypyFile | None, owners: list[str]) -> FuncDef | None:
        statements: list[Statement] = tree.defs if tree else []
        node: Statement | None = None
        for owner in owners:
            node = next((candidate for candidate in (statement.func if isinstance(statement, Decorator) else statement for statement in statements)
                         if getattr(candidate, "name", None) == owner), None)
            if node is None:
                return None
            statements = node.defs.body if isinstance(node, ClassDef) else node.body.body if isinstance(node, FuncDef) else []
        return node if isinstance(node, FuncDef) else None


def all_arguments(function: ast.FunctionDef | ast.AsyncFunctionDef | ast.Lambda) -> list[ast.arg]:
    arguments = function.args
    return arguments.args + arguments.kwonlyargs + arguments.posonlyargs + [argument for argument in (arguments.vararg, arguments.kwarg) if argument]


def add_unique_untyped(plans: list[Plan], project: Project) -> None:
    plans_per_member: dict[str, list[Plan]] = collections.defaultdict(list)
    for plan in plans:
        if plan.member:
            plans_per_member[plan.member].append(plan)
    for name, group in plans_per_member.items():
        new_names = {place.new for plan in group for place in plan.places if place.old == name}
        defining = {definer.fullname for definition in project.class_definitions() if (definer := topmost_definer(definition.info, name)) is not None}
        if len(new_names) == 1 and defining <= set[str]().union(*(plan.defining_classes for plan in group)):
            for plan in group:
                plan.places += [place for place in plan.untyped if place not in plan.places]


def merged_members(plans: list[Plan], project: Project) -> list[str]:
    conflicts: list[str] = []
    for definition in project.class_definitions():
        bases = {base.fullname for base in definition.info.mro}
        members_per_new_name: dict[str, set[str]] = collections.defaultdict(set)
        for plan in plans:
            if plan.owners & bases and plan.places:
                members_per_new_name[next(place.new for place in plan.places if place.old == plan.member)].add(plan.member)
        conflicts += [f"nothing written: {definition.info.fullname} would have {', '.join(sorted(members))} all named {new}"
                      for new, members in members_per_new_name.items() if len(members) > 1]
    return conflicts


def unplaced_uses(plans: list[Plan], root: str) -> list[str]:
    old_names = {plan.member for plan in plans if plan.member}
    files = project_files(root)
    defined: set[str] = set()
    for path in files:
        for node in ast.walk(ast.parse(read_text(path))):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                defined.add(node.name)
            elif isinstance(node, (ast.Assign, ast.AnnAssign)):
                for target in node.targets if isinstance(node, ast.Assign) else [node.target]:
                    defined.update(part.attr if isinstance(part, ast.Attribute) else part.id for part in ast.walk(target) if isinstance(part, (ast.Name, ast.Attribute)))
    removed = old_names - defined
    uses: list[str] = []
    for path in files:
        tokens = file_tokens(path)
        uses += [f"{path}:{token.start[0]} {token.string}" for index, token in enumerate(tokens)
                 if token.type == tokenize.NAME and token.string in removed and index > 1 and tokens[index - 1].string == "." and tokens[index - 2].string not in LIBRARY_RECEIVERS]
    return uses


def snake_case(name: str) -> str:
    return re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()


def write_plans(plans: list[Plan], root: str) -> int:
    places_per_file: dict[str, set[Place]] = collections.defaultdict(set)
    for plan in plans:
        for place in plan.places:
            places_per_file[place.path].add(place)
    for path, places in places_per_file.items():
        lines = file_lines(path)
        for place in sorted({located(lines, place) for place in places}, key=lambda place: (place.line, place.column), reverse=True):
            text = lines[place.line - 1]
            lines[place.line - 1] = text[:place.column] + place.new + text[place.column + len(place.old):]
        with open(path, "w", encoding="utf-8") as file:
            file.write("".join(lines))
    modules: dict[str, str] = {}
    for plan in plans:
        for old, new in plan.moves:
            subprocess.run(["git", "-C", root, "mv", os.path.relpath(old, root), os.path.relpath(new, root)], check=True)
            modules[dotted_module(old, root)] = dotted_module(new, root)
    changed = set(places_per_file)
    for path in project_files(root) if modules else []:
        source = read_text(path)
        updated = source
        for old, new in modules.items():
            updated = re.sub(rf"\b{re.escape(old)}\b", new, updated)
        if updated != source:
            with open(path, "w", encoding="utf-8") as file:
                file.write(updated)
            changed.add(path)
    return len(changed)


def located(lines: list[str], place: Place) -> Place:
    text = lines[place.line - 1]
    if text[place.column:place.column + len(place.old)] == place.old:
        return place
    starts = [match.start() for match in re.finditer(rf"(?<![\w]){re.escape(place.old)}(?!\w)", text)]
    if not starts:
        raise SystemExit(f"nothing written: {place.path}:{place.line}:{place.column} holds no {place.old}: {text.strip()}")
    column = min(starts, key=lambda start: abs(start - place.column))
    return Place(place.path, place.line, column, place.old, place.new, place.quoted)


def dotted_module(path: str, root: str) -> str:
    return os.path.relpath(path, f"{root}/src")[:-3].replace(os.sep, ".")


def list_pairs(path: str) -> list[tuple[str, str]]:
    names = [line.split("#", 1)[0].split() for line in read_text(path).splitlines()]
    return [(parts[0], parts[1]) for parts in names if len(parts) == 2]


def main(arguments: list[str]) -> int:
    root = next((argument.split("=", 1)[1] for argument in arguments if argument.startswith("--root=")), ".")
    is_dry_run = "--dry-run" in arguments
    pairs = [pair for argument in arguments if argument.startswith("--list=") for pair in list_pairs(argument.split("=", 1)[1])]
    names = [argument for argument in arguments if not argument.startswith("--")]
    pairs += list(zip(names[::2], names[1::2]))
    if not pairs:
        print(__doc__)
        return 2
    renamer = Renamer(Project(root), NamingRules(root))
    plans: list[Plan] = []
    for old, new in pairs:
        plan = renamer.plan(old, new)
        plans.append(plan)
        files = len({place.path for place in plan.places})
        status = "refused: " + "; ".join(plan.refusals) if plan.refusals else f"{len(plan.places)} places in {files} files" + (f", moves {len(plan.moves)} file" if plan.moves else "")
        print(f"{old} -> {new}: {status}")
        for location in plan.unplaced:
            print(f"  untyped use: {location}")
    add_unique_untyped(plans, renamer.project)
    for conflict in merged_members(plans, renamer.project):
        print(conflict)
        return 1
    new_names_per_position: dict[tuple[str, int, int], set[str]] = collections.defaultdict(set)
    for plan in plans:
        for place in plan.places:
            new_names_per_position[(place.path, place.line, place.column)].add(place.new)
    conflicts = [f"{path}:{line}" for (path, line, _), new_names in new_names_per_position.items() if len(new_names) > 1]
    if conflicts:
        print("nothing written: two renames reach the same position at " + ", ".join(conflicts[:10]))
        return 1
    if any(plan.refusals for plan in plans):
        print("nothing written: a rename was refused")
        return 1
    if is_dry_run:
        for plan in plans:
            for place in plan.places:
                print(f"  {os.path.relpath(place.path, root)}:{place.line}")
        return 0
    print(f"{write_plans(plans, root)} files changed")
    uses = unplaced_uses(plans, root)
    for use in uses:
        print(f"  unplaced: {use}")
    return 1 if uses else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
