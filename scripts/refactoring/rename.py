"""Rename a name in the journal package and its tests, with everything that depends on it.

  python3 scripts/refactoring/rename.py Clock Timepiece
  python3 scripts/refactoring/rename.py Agents.live current
  python3 scripts/refactoring/rename.py journal.support.chain.LEADS CONTROL_KEYWORDS
  python3 scripts/refactoring/rename.py src/journal/support/chain.py:Chain.spans.line text
  python3 scripts/refactoring/rename.py --list=renames.txt --dry-run

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

A list line is `Old New`, or `Old New # why`; blank lines and lines starting with # are skipped. The new name
is refused when the project's plain-name rules ban it or when it already stands where the old one does.
Any number of renames go in one call or one list: all are planned against one reading of the code and written
together, and two that reach the same spot are refused. docs/the-rules.md follows a renamed Class.method.
`--dry-run` reports every place without writing. A rename writes only on a clean working tree, so it can always
be undone by going back to the last commit. `--root=DIR` works on another checkout. Needs mypy.
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
from dataclasses import dataclass, field

from mypy import build
from mypy.modulefinder import BuildSource
from mypy.nodes import AssignmentStmt, CallExpr, ClassDef, Decorator, FuncDef, MemberExpr, MypyFile, NameExpr, OverloadedFuncDef, SuperExpr, TypeInfo, Var
from mypy.options import Options
from mypy.server.subexpr import get_subexpressions
from mypy.types import CallableType, Instance, TypeType, UnionType, get_proper_type

RULES = ".commandments/custom"
SELECTS = {"class": "type-declaration", "method": "function", "member": "identifier", "module": "identifier", "local": "identifier", "parameter": "parameter"}


@dataclass(frozen=True)
class Place:
    """One spot in one file where an old name is written and the new one goes."""

    path: str
    line: int
    column: int
    old: str
    new: str
    quoted: bool = False


@dataclass
class Plan:
    """What one rename touches: its places, the files it moves, the uses it could not place, and why it is refused if it is."""

    places: list[Place] = field(default_factory=list)
    moves: list[tuple[str, str]] = field(default_factory=list)
    loose: list[str] = field(default_factory=list)
    refusals: list[str] = field(default_factory=list)
    mentions: list[tuple[str, str]] = field(default_factory=list)


class Project:
    """The package and its tests as mypy reads them, once per run."""

    def __init__(self, root: str) -> None:
        self.root = root
        self.files = sorted(glob.glob(f"{root}/src/journal/**/*.py", recursive=True)) + sorted(glob.glob(f"{root}/tests/*.py"))
        options = Options()
        options.export_types = True
        options.ignore_missing_imports = True
        options.check_untyped_defs = True
        options.incremental = False
        options.preserve_asts = True
        options.explicit_package_bases = True
        options.mypy_path = [f"{root}/src", root]
        sources = [BuildSource(path, self.module_of(path), base_dir=self.base_of(path)) for path in self.files]
        self.result = build.build(sources, options)
        self.types = self.result.types
        self.trees: dict[str, MypyFile] = {state.xpath: state.tree for state in self.result.graph.values() if state.tree is not None and state.xpath in self.files}
        self.expressions = {path: get_subexpressions(tree) for path, tree in self.trees.items()}

    def module_of(self, path: str) -> str:
        relative = os.path.relpath(path, f"{self.root}/src" if "/src/" in path else self.root)
        return relative[:-3].replace(os.sep, ".").removesuffix(".__init__")

    def base_of(self, path: str) -> str:
        return f"{self.root}/src" if "/src/" in path else self.root

    def classes(self, name: str) -> list[TypeInfo]:
        found = []
        for tree in self.trees.values():
            for node in walk_classes(tree.defs):
                if node.fullname == name or node.name == name:
                    found.append(node.info)
        return found

    def class_defs(self) -> list[ClassDef]:
        return [node for tree in self.trees.values() for node in walk_classes(tree.defs)]


def walk_classes(statements):
    for statement in statements:
        if isinstance(statement, ClassDef):
            yield statement
            yield from walk_classes(statement.defs.body)


def lines_of(path: str) -> list[str]:
    return open(path, encoding="utf-8").read().splitlines(keepends=True)


def info_of(t) -> TypeInfo | None:
    t = get_proper_type(t)
    if isinstance(t, Instance):
        return t.type
    if isinstance(t, TypeType):
        item = get_proper_type(t.item)
        return item.type if isinstance(item, Instance) else None
    if isinstance(t, CallableType) and t.is_type_obj():
        return t.type_object()
    if isinstance(t, UnionType):
        found = {info_of(item) for item in t.items} - {None}
        found = {info for info in found if info.fullname != "builtins.None"}
        return found.pop() if len(found) == 1 else None
    return None


def root_of(info: TypeInfo, name: str) -> TypeInfo | None:
    """The topmost class in the MRO that defines the name, so an override and what it overrides rename together."""
    defining = [base for base in info.mro if name in base.names]
    return defining[-1] if defining else None


class Rules:
    """The project's plain-name rules, read from its custom detectors and their shared word lists."""

    def __init__(self, root: str) -> None:
        folder = f"{root}/{RULES}"
        lists = json.load(open(f"{folder}/lists.json")) if os.path.exists(f"{folder}/lists.json") else {}
        expand = lambda pattern: re.sub(r"\$\{(\w+)\}", lambda m: "|".join(re.escape(word) for word in lists[m.group(1)]), pattern)
        self.patterns = collections.defaultdict(list)
        for path in glob.glob(f"{folder}/Poetic*NameDetector.json") + glob.glob(f"{folder}/Sentence*NameDetector.json"):
            rule = json.load(open(path))
            rejects = [re.compile(item["nameMatches"]) for item in rule.get("reject", []) if "nameMatches" in item]
            self.patterns[rule["find"]["select"]].append((re.compile(expand(rule["find"]["where"][0]["nameMatches"])), rejects))

    def refusal(self, kind: str, name: str) -> str:
        for pattern, rejects in self.patterns[SELECTS[kind]]:
            match = pattern.search(name)
            if match and not any(reject.search(name) for reject in rejects):
                return f"{name} is banned by the plain-name rules ({match.group(0).strip('_')})"
        return ""


class Renamer:
    """Plans each rename against the project as mypy read it, then writes every plan at once."""

    def __init__(self, project: Project, rules: Rules) -> None:
        self.project, self.rules = project, rules

    def plan(self, old: str, new: str) -> Plan:
        if ":" in old:
            return self.local(old, new)
        if "." in old and old.split(".")[0] == "journal":
            return self.module_name(old, new)
        if "." in old:
            return self.member(old, new)
        return self.klass(old, new)

    def klass(self, old: str, new: str) -> Plan:
        plan = Plan()
        infos = self.project.classes(old)
        if len(infos) != 1:
            plan.refusals.append(f"{old} names {len(infos)} classes; give its full name, journal.module.{old}")
            return plan
        info = infos[0]
        plan.refusals += [r for r in [self.rules.refusal("class", new)] if r]
        if self.project.classes(new):
            plan.refusals.append(f"a class named {new} already stands")
        self.references(info.fullname, info.name, new, plan)
        plan.mentions.append((rf"\b{old}\.", f"{new}."))
        defining = self.project.result.graph[info.module_name].xpath
        stem = snake(info.name)
        if os.path.basename(defining) == f"{stem}.py":
            plan.moves.append((defining, os.path.join(os.path.dirname(defining), f"{snake(new)}.py")))
        return plan

    def module_name(self, old: str, new: str) -> Plan:
        plan = Plan()
        module, _, name = old.rpartition(".")
        state = self.project.result.graph.get(module)
        if state is None or name not in state.tree.names:
            plan.refusals.append(f"{module} defines no {name}")
            return plan
        kind = "method" if isinstance(state.tree.names[name].node, FuncDef) else "module"
        plan.refusals += [r for r in [self.rules.refusal(kind, new)] if r]
        if new in state.tree.names:
            plan.refusals.append(f"{module} already defines {new}")
        self.references(old, name, new, plan)
        return plan

    def references(self, fullname: str, old: str, new: str, plan: Plan) -> None:
        """Every reference to one top-level definition: each bare use in its own module and in the modules that import it, its quoted annotations, and each module.attribute use mypy resolves to it."""
        module = fullname.rpartition(".")[0]
        for path in self.project.files:
            source = open(path, encoding="utf-8").read()
            if path == self.defining_file(module) or re.search(rf"from {re.escape(module)} import (\([^)]*|[^\n]*)\b{old}\b", source):
                plan.places += self.bare_places(path, old, new)
                plan.places += self.quoted_places(path, old, new)
        for path, expressions in self.project.expressions.items():
            for node in expressions:
                if isinstance(node, MemberExpr) and node.fullname == fullname and node.end_column is not None:
                    plan.places.append(Place(path, node.end_line, node.end_column - len(old), old, new))

    def bare_places(self, path: str, old: str, new: str) -> list[Place]:
        """Each token of the name not reached through a dot and not a keyword argument's name."""
        places, depth = [], 0
        toks = list(tokenize.generate_tokens(io.StringIO(open(path, encoding="utf-8").read()).readline))
        for i, tok in enumerate(toks):
            if tok.type == tokenize.OP and tok.string in "([{":
                depth += 1
            elif tok.type == tokenize.OP and tok.string in ")]}":
                depth -= 1
            elif tok.type == tokenize.NAME and tok.string == old and toks[i - 1].string != ".":
                keyword = depth > 0 and toks[i + 1].string == "=" and toks[i - 1].string in ("(", ",")
                if not keyword:
                    places.append(Place(path, tok.start[0], tok.start[1], old, new))
        return places

    def defining_file(self, module: str) -> str:
        state = self.project.result.graph.get(module)
        return state.xpath if state else ""

    def definition_place(self, path: str, node, old: str, new: str) -> Place:
        line = lines_of(path)[node.line - 1]
        match = re.search(rf"\b(?:def|class)\s+{re.escape(old)}\b", line) or re.search(rf"\b{re.escape(old)}\b", line)
        column = match.end() - len(old) if match.group(0).startswith(("def", "class")) else match.start()
        return Place(path, node.line, column, old, new)

    def import_places(self, path: str, module: str, old: str, new: str) -> list[Place]:
        places, toks = [], list(tokenize.generate_tokens(io.StringIO(open(path, encoding="utf-8").read()).readline))
        inside = False
        for i, tok in enumerate(toks):
            if tok.type == tokenize.NAME and tok.string == "from":
                dotted = "".join(t.string for t in toks[i + 1:i + 40] if t.string != "import" and t.type in (tokenize.NAME, tokenize.OP))
                inside = dotted.startswith(module + "import") or "".join(t.string for t in toks[i + 1:]).startswith(module + "import")
            elif tok.type == tokenize.NEWLINE:
                inside = False
            elif inside and tok.type == tokenize.NAME and tok.string == old and toks[i - 1].string != ".":
                places.append(Place(path, tok.start[0], tok.start[1], old, new))
        return places

    def quoted_places(self, path: str, old: str, new: str) -> list[Place]:
        places, toks = [], list(tokenize.generate_tokens(io.StringIO(open(path, encoding="utf-8").read()).readline))
        for i, tok in enumerate(toks):
            if tok.type == tokenize.STRING and tok.string in (f'"{old}"', f"'{old}'") and i > 0 and toks[i - 1].string in ("->", ":", "[", ",", "("):
                places.append(Place(path, tok.start[0], tok.start[1] + 1, old, new, quoted=True))
        return places

    def member(self, old: str, new: str) -> Plan:
        plan = Plan()
        owner, _, name = old.rpartition(".")
        infos = [root_of(info, name) for info in self.project.classes(owner)]
        roots = {info.fullname: info for info in infos if info is not None}
        if len(roots) != 1:
            plan.refusals.append(f"{owner} defines no {name}" if not roots else f"{owner} names {len(roots)} classes with a {name}; give the full class name")
            return plan
        group = next(iter(roots.values()))
        kind = "method" if isinstance(group.names[name].node, (FuncDef, Decorator, OverloadedFuncDef)) else "member"
        plan.refusals += [r for r in [self.rules.refusal(kind, new)] if r]
        members = [c for c in self.project.class_defs() if name in c.info.names and root_of(c.info, name) is group]
        plan.mentions += [(rf"\b{c.name}\.{name}\b", f"{c.name}.{new}") for c in members]
        for c in members:
            if new in c.info.names:
                plan.refusals.append(f"{c.info.fullname} already has {new}")
        unique = sum(1 for c in self.project.class_defs() if name in c.info.names and root_of(c.info, name) is not group) == 0
        for path, tree in self.project.trees.items():
            for c in walk_classes(tree.defs):
                if c in members:
                    for statement in c.defs.body:
                        target = statement.func if isinstance(statement, Decorator) else statement
                        if isinstance(target, (FuncDef, OverloadedFuncDef)) and target.name == name:
                            plan.places.append(self.definition_place(path, target, name, new))
                        elif isinstance(statement, AssignmentStmt):
                            for lvalue in statement.lvalues:
                                if isinstance(lvalue, NameExpr) and lvalue.name == name:
                                    plan.places.append(Place(path, lvalue.line, lvalue.column, name, new))
        for path, expressions in self.project.expressions.items():
            for node in expressions:
                if isinstance(node, (MemberExpr, SuperExpr)) and node.name == name and node.end_column is not None:
                    receiver = node.info if isinstance(node, SuperExpr) else info_of(self.project.types.get(node.expr)) if node.expr in self.project.types else None
                    receiver = receiver or (self.guessed(node.expr) if isinstance(node, MemberExpr) else None)
                    place = Place(path, node.end_line, node.end_column - len(name), name, new)
                    if receiver is not None and root_of(receiver, name) is group:
                        plan.places.append(place)
                    elif receiver is None:
                        plan.loose.append(f"{path}:{node.end_line}")
                        if unique:
                            plan.places.append(place)
                elif isinstance(node, CallExpr) and kind == "member" and name in node.arg_names:
                    callee = info_of(self.project.types.get(node.callee)) if node.callee in self.project.types else None
                    if callee is not None and root_of(callee, name) is group:
                        plan.places += self.keyword_places(path, node, name, new)
        return plan

    def guessed(self, receiver) -> TypeInfo | None:
        """The class of an untyped receiver when its text says it: container.get(Class), or a name such as self.scope that is one class's name in snake case."""
        if isinstance(receiver, CallExpr) and isinstance(receiver.callee, MemberExpr) and receiver.callee.name == "get" and receiver.args and isinstance(getattr(receiver.args[0], "node", None), TypeInfo):
            return receiver.args[0].node
        word = receiver.name if isinstance(receiver, (NameExpr, MemberExpr)) else ""
        matches = [c.info for c in self.project.class_defs() if snake(c.name) == word]
        return matches[0] if len(matches) == 1 else None

    def keyword_places(self, path: str, call: CallExpr, old: str, new: str) -> list[Place]:
        places = []
        text = lines_of(path)
        for line in range(call.line, (call.end_line or call.line) + 1):
            for match in re.finditer(rf"(?<![\w.]){re.escape(old)}(?=\s*=[^=])", text[line - 1]):
                places.append(Place(path, line, match.start(), old, new))
        return places

    def local(self, old: str, new: str) -> Plan:
        plan = Plan()
        path, _, dotted = old.partition(":")
        path = os.path.join(self.project.root, path) if not path.startswith(self.project.root) else path
        *owners, name = dotted.split(".")
        function = self.find_function(self.project.trees.get(path), owners)
        if function is None:
            plan.refusals.append(f"{path} has no function {'.'.join(owners)}")
            return plan
        variables = [arg.variable for arg in function.arguments if arg.variable.name == name]
        parameter = bool(variables)
        plan.refusals += [r for r in [self.rules.refusal("parameter" if parameter else "local", new)] if r]
        inside = [n for n in get_subexpressions(function) if isinstance(n, NameExpr)]
        if any(n.name == new for n in inside) or any(arg.variable.name == new for arg in function.arguments):
            plan.refusals.append(f"{new} already stands inside {'.'.join(owners)}")
        for node in inside:
            if node.name == name and isinstance(node.node, Var) and (not variables or node.node in variables or node.node.name == name) and node.node.is_inferred or node.name == name and node.node in variables:
                plan.places.append(Place(path, node.line, node.column, name, new))
        for arg in function.arguments:
            if arg.variable.name == name:
                line = lines_of(path)[arg.line - 1]
                plan.places.append(Place(path, arg.line, arg.column if line[arg.column:arg.column + len(name)] == name else line.index(name, arg.column), name, new))
        if parameter:
            for other, expressions in self.project.expressions.items():
                for node in expressions:
                    if isinstance(node, CallExpr) and name in node.arg_names and self.calls(node, function):
                        plan.places += self.keyword_places(other, node, name, new)
        plan.places = sorted(set(plan.places), key=lambda p: (p.path, p.line, p.column))
        return plan

    def calls(self, call: CallExpr, function: FuncDef) -> bool:
        callee = call.callee
        if isinstance(callee, MemberExpr) and callee.expr in self.project.types:
            info = info_of(self.project.types[callee.expr])
            return info is not None and function.info is not None and info.has_base(function.info.fullname) and callee.name == function.name
        return isinstance(callee, NameExpr) and callee.node is function

    def find_function(self, tree: MypyFile | None, owners: list[str]) -> FuncDef | None:
        statements = tree.defs if tree else []
        node = None
        for owner in owners:
            node = next((s.func if isinstance(s, Decorator) else s for s in statements if getattr(s.func if isinstance(s, Decorator) else s, "name", None) == owner), None)
            if node is None:
                return None
            statements = node.defs.body if isinstance(node, ClassDef) else node.body.body if isinstance(node, FuncDef) else []
        return node if isinstance(node, FuncDef) else None


def walk_definitions(statements):
    for statement in statements:
        target = statement.func if isinstance(statement, Decorator) else statement
        if isinstance(target, (FuncDef, ClassDef, OverloadedFuncDef)):
            yield target
        if isinstance(statement, AssignmentStmt):
            for lvalue in statement.lvalues:
                if isinstance(lvalue, NameExpr):
                    yield lvalue
        if isinstance(statement, ClassDef):
            yield from walk_definitions(statement.defs.body)


def snake(name: str) -> str:
    return re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()


def written(plans: list[Plan], root: str) -> int:
    """Every plan's places spliced in, files moved, dotted module paths and the rules table updated; the count of files changed."""
    by_file = collections.defaultdict(set)
    for plan in plans:
        for place in plan.places:
            by_file[place.path].add(place)
    for path, places in by_file.items():
        lines = lines_of(path)
        for place in sorted(places, key=lambda p: (p.line, p.column), reverse=True):
            text = lines[place.line - 1]
            if text[place.column:place.column + len(place.old)] != place.old:
                raise SystemExit(f"{path}:{place.line}:{place.column} holds no {place.old}: {text.strip()}")
            lines[place.line - 1] = text[:place.column] + place.new + text[place.column + len(place.old):]
        open(path, "w", encoding="utf-8").write("".join(lines))
    table = os.path.join(root, "docs/the-rules.md")
    if os.path.exists(table):
        text = open(table, encoding="utf-8").read()
        updated = text
        for plan in plans:
            for pattern, replacement in plan.mentions:
                updated = re.sub(pattern, replacement, updated)
        if updated != text:
            open(table, "w", encoding="utf-8").write(updated)
    modules = {}
    for plan in plans:
        for old, new in plan.moves:
            subprocess.run(["git", "-C", root, "mv", os.path.relpath(old, root), os.path.relpath(new, root)], check=True)
            modules[module_path(old, root)] = module_path(new, root)
    if modules:
        for path in glob.glob(f"{root}/src/journal/**/*.py", recursive=True) + glob.glob(f"{root}/tests/*.py"):
            source = open(path, encoding="utf-8").read()
            updated = source
            for old, new in modules.items():
                updated = re.sub(rf"\b{re.escape(old)}\b", new, updated)
            if updated != source:
                open(path, "w", encoding="utf-8").write(updated)
                by_file[path] = by_file.get(path, set())
    return len(by_file)


def module_path(path: str, root: str) -> str:
    return os.path.relpath(path, f"{root}/src")[:-3].replace(os.sep, ".")


def listed(path: str) -> list[tuple[str, str]]:
    pairs = []
    for line in open(path, encoding="utf-8"):
        words = line.split("#", 1)[0].split()
        if len(words) == 2:
            pairs.append((words[0], words[1]))
    return pairs


def main(arguments: list[str]) -> int:
    root = next((a.split("=", 1)[1] for a in arguments if a.startswith("--root=")), ".")
    dry = "--dry-run" in arguments
    pairs = [pair for a in arguments if a.startswith("--list=") for pair in listed(a.split("=", 1)[1])]
    plain = [a for a in arguments if not a.startswith("--")]
    pairs += list(zip(plain[::2], plain[1::2]))
    if not pairs:
        print(__doc__)
        return 2
    renamer = Renamer(Project(root), Rules(root))
    plans = []
    for old, new in pairs:
        plan = renamer.plan(old, new)
        plans.append(plan)
        status = "refused: " + "; ".join(plan.refusals) if plan.refusals else f"{len(plan.places)} places in {len({p.path for p in plan.places})} files" + (f", moves {len(plan.moves)} file" if plan.moves else "")
        print(f"{old} -> {new}: {status}")
        for spot in plan.loose:
            print(f"  untyped use: {spot}")
    spots = collections.defaultdict(set)
    for plan in plans:
        for place in plan.places:
            spots[(place.path, place.line, place.column)].add(place.new)
    clashes = [f"{path}:{line}" for (path, line, _), news in spots.items() if len(news) > 1]
    if clashes:
        print("nothing written: two renames reach the same spot at " + ", ".join(clashes[:10]))
        return 1
    if any(plan.refusals for plan in plans):
        print("nothing written: a rename was refused")
        return 1
    if dry:
        return 0
    if subprocess.run(["git", "-C", root, "status", "--porcelain"], capture_output=True, text=True).stdout.strip():
        print("nothing written: commit every change first, so a rename can always be undone by going back to it")
        return 1
    print(f"{written(plans, root)} files changed")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
