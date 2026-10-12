"""What a feature may import, walked over every feature package at boot.

A feature talks to the rest of the journal through events and the services it asks for, and through
nothing else. This walk reads the imports rather than trusting that, so a feature reaching into
another feature, or into the controllers, is named here on start rather than found by the person who
later cannot move either of them.

It reports today and refuses once the list it reports is empty: the moves that close it are the rows
before this one in the plan, and refusing while 244 lines are still open would stop the journal that
is doing the moving.
"""

import ast
from dataclasses import dataclass
from pathlib import Path

ALLOWED = ("events", "declaring", "framework", "expects", "resources", "serving", "receiving")
"""The packages every feature may name: the event catalogue, the declarations, the expects grammar,
the row types and their constants, and the two sides of the engine it is registered through."""

ALSO = ("engine.services", "engine.wording", "engine.version")
"""The modules named in full that a feature may also import: the services' own types, which a
registration names to ask for one, and the pure helpers that are this codebase's own standard
library, named one by one so the door is as wide as they are."""

OWN = "features"

DOOR = ("controllers.types",)
"""The one old way in that is allowed and counted apart: a feature writes through a controller reached by its class, Todos(record, actor=SYSTEM). It closes when the sweep replaces those writes with the services a feature asks for, so its size is how much of that sweep is left, and it is said beside the boundary rather than folded into what is allowed."""


@dataclass(frozen=True)
class Reach:
    """One import a feature makes outside what it may name."""

    feature: str
    module: str
    imports: str
    line: int
    door: bool = False

    def said(self) -> str:
        return f"{self.feature} reaches {self.imports} in {self.module}, line {self.line}"


class ReachesOutside(ImportError):
    @classmethod
    def of(cls, found: list[Reach]) -> "ReachesOutside":
        return cls("a feature talks through events and the services it asks for, and through nothing else: "
                   + "; ".join(one.said() for one in found))


def named(tree: ast.AST) -> list[tuple[str, int]]:
    """Every module one file imports, with the line it is named on."""
    found = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            found.extend((alias.name, node.lineno) for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
            found.append((node.module, node.lineno))
    return found


@dataclass(frozen=True)
class Boundary:
    """What the features of one source tree may name. Built from the tree itself, so a package added beside them is known to be one rather than mistaken for the standard library."""

    packages: frozenset[str]

    @classmethod
    def of(cls, src: Path) -> "Boundary":
        return cls(frozenset(one.name for one in src.iterdir() if one.is_dir() and (one / "__init__.py").is_file()))

    def allows(self, module: str, feature: str) -> bool:
        """Whether a feature may name this module: its own package, the packages every feature may name, or the standard library, which is anything the source tree does not hold."""
        head = module.split(".")[0]
        if head in ALLOWED or module in ALSO:
            return True
        if head != OWN:
            return head not in self.packages
        return module.split(".")[1:2] == [feature]

    def reaches(self, features: Path) -> list[Reach]:
        """Every import a feature makes that it may not, over every module of every feature package."""
        found = []
        for folder in sorted(one for one in features.iterdir() if one.is_dir() and (one / "__init__.py").is_file()):
            for module in sorted(folder.rglob("*.py")):
                if module.name == "test.py":
                    continue
                tree = ast.parse(module.read_text(), str(module))
                found.extend(Reach(folder.name, str(module.relative_to(features.parent)), name, line, name in DOOR)
                             for name, line in named(tree) if not self.allows(name, folder.name))
        return found


@dataclass(frozen=True)
class Walk:
    """What the features reach for: past the boundary, and through the controllers door that closes with the sweep."""

    outside: list[Reach]
    through_the_door: list[Reach]

    def said(self) -> str:
        return f"{len(self.outside)} outside, {len(self.through_the_door)} through the controllers door, which closes with the sweep"


def walked(src: Path, refusing: bool = False) -> Walk:
    """Walks every feature and answers what it reaches for, the boundary and the door counted apart. Raises instead when refusing and anything is outside, which it does once the moves that close the list are done; the door never refuses."""
    found = Boundary.of(src).reaches(src / OWN)
    walk = Walk([one for one in found if not one.door], [one for one in found if one.door])
    if refusing and walk.outside:
        raise ReachesOutside.of(walk.outside)
    return walk
