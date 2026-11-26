"""Writes the move list of task 3549 (report 415): every project-own class of app/ into its subject's folder.

A class already in a subject folder of its kind (app/Commands/Hosts/...) moves to app/<Subject>/<Kind>/...; a loose
class goes to the subject report 415's tree names for it, or else to the one subject whose classes use it, and stays
where it is when no subject or several do. Laravel's own folders keep their place. Prints `Old New # why` lines for
tools/refactoring/move.php --list, and the classes it left with their reason on standard error.

    python3 tools/refactoring/layout/subject-moves.py <report 415 as text> > moves.txt
"""

import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]

# Laravel's own folders: grouped by subject inside, never moved.
LARAVEL = {"Http", "Models", "Providers", "Console", "Events", "Listeners", "Policies", "Jobs", "Observers", "Casts", "Mail"}

# The project's own kinds that move into their subject.
MOVABLE = {"Commands", "Contracts", "Enums", "Data", "Values", "Exceptions", "Pipes", "Pipelines", "Resolvers",
           "Concerns", "Declarations", "CommandMiddleware", "Attributes", "Pages", "Actions", "Support"}

# Kinds that sit in the subject's root once moved, as the tree of report 415 places Support classes.
ROOT_KINDS = {"Support"}

# The subject folders of today's kind folders, named as report 415's subjects.
SUBJECTS = {
    "Access": "Access", "Accounts": "Accounts", "Activity": "Agents/Activity", "Actors": "Actors",
    "Admission": "Access", "Agents": "Agents", "Asks": "Asks", "Questions": "Asks", "Assignments": "Assignments",
    "Authorization": "Access", "Bus": "Bus", "CommandLines": "Processes", "CommandRules": "CommandRules",
    "Connections": "Connections", "Docks": "Docking", "Docking": "Docking", "Drafts": "Web/Drafts",
    "Drivers": "Agents/Drivers", "Engine": "Engine", "Files": "Files", "Hooks": "Hooks", "Hosts": "Hosts",
    "Inboxes": "Inboxes", "Layouts": "Terminals", "Links": "Links", "Messages": "Messages",
    "Navigation": "Navigation", "Notifications": "Notifications", "Presence": "Agents/Status",
    "Processes": "Processes", "Profiles": "Profiles", "Projects": "Projects", "Reads": "Reads",
    "Receipts": "Bus/Receipts", "Records": "Records", "Reflection": "Reflection", "Runs": "Processes",
    "Screens": "Terminals/Screens", "KeyScripts": "Terminals/KeyScripts", "Scripts": "Scripts", "Search": "Search",
    "Sessions": "Sessions", "Settings": "Settings", "Sharing": "Sharing", "Skills": "Skills", "Terminals": "Terminals",
    "Time": "Time", "Web": "Web", "Grammar": "Processes/Grammar", "Readers": "Processes/Readers",
    "Relay": "Agents/Relay", "Stack": "Stacks", "States": "Stacks", "Text": "Text", "Numbers": "Numbers",
}

NAMESPACE = re.compile(r"^namespace\s+([^;]+);", re.M)
DECLARED = re.compile(r"^(?:final\s+|abstract\s+|readonly\s+)*(?:class|interface|trait|enum)\s+(\w+)", re.M)
IMPORT = re.compile(r"^use\s+App\\([^;{]+);", re.M)
WORD = re.compile(r"\b[A-Z]\w+\b")


def classes() -> dict[str, Path]:
    found = {}
    for path in (ROOT / "app").rglob("*.php"):
        text = path.read_text(errors="replace")
        namespace, declared = NAMESPACE.search(text), DECLARED.search(text)
        if namespace and declared:
            found[f"{namespace.group(1)}\\{declared.group(1)}"] = path
    return found


def users(found: dict[str, Path]) -> dict[str, set[str]]:
    by_namespace = defaultdict(set)
    for name in found:
        by_namespace[name.rsplit("\\", 1)[0]].add(name)
    used = defaultdict(set)
    for name, path in found.items():
        text = path.read_text(errors="replace")
        for imported in IMPORT.findall(text):
            target = "App\\" + imported.split(" as ")[0].strip()
            if target in found and target != name:
                used[target].add(name)
        own = name.rsplit("\\", 1)[0]
        words = set(WORD.findall(text))
        for neighbour in by_namespace[own]:
            if neighbour != name and neighbour.rsplit("\\", 1)[1] in words:
                used[neighbour].add(name)
    return used


def tree_places(report: str) -> dict[str, str]:
    """The subject report 415's tree names for each Support file, None for one marked global."""
    places, subject = {}, None
    for line in report.splitlines():
        top = re.match(r"^(?:├|└)── ([A-Za-z]+)/", line)
        if top:
            subject = top.group(1)
            continue
        sub = re.match(r"^│   (?:├|└)── ([A-Za-z]+)/\s+\(", line)
        if sub and subject:
            continue
        leaf = re.match(r"^│   (?:│   )?(?:├|└)── (\w+)\.php(.*)$", line)
        if leaf and subject:
            places[leaf.group(1)] = None if "[global]" in leaf.group(2) else subject
    return places


def anchored(name: str) -> str | None:
    """The subject a class's place already names: the subject folder of its kind, or a subject folder itself."""
    parts = name.split("\\")[1:]
    kind = parts[0]
    if kind in MOVABLE | LARAVEL:
        return SUBJECTS.get(parts[1]) if len(parts) > 2 else None
    return SUBJECTS.get(kind)


def target(name: str, subject: str) -> str:
    parts = name.split("\\")[1:]
    kind, rest = parts[0], parts[1:]
    if len(rest) > 1 and rest[0] in SUBJECTS and SUBJECTS[rest[0]] == subject:
        rest = rest[1:]
    prefix = subject.split("/")
    if kind in ROOT_KINDS:
        return "\\".join(["App", *prefix, *rest])
    return "\\".join(["App", *prefix, kind, *rest])


def main() -> None:
    report = Path(sys.argv[1]).read_text()
    found = classes()
    used = users(found)
    places = tree_places(report)
    subject_of = {name: anchored(name) for name in found}
    left = {}
    for _ in range(3):
        for name in found:
            parts = name.split("\\")[1:]
            if subject_of[name] is not None or parts[0] not in MOVABLE:
                continue
            short = parts[-1]
            if short in places:
                if places[short] is None:
                    left[name] = "report 415 marks it global"
                    continue
                subject_of[name] = places[short]
                continue
            subjects = {subject_of[user] for user in used[name]} - {None}
            if len(subjects) == 1:
                subject_of[name] = subjects.pop()
                left.pop(name, None)
            else:
                left[name] = f"used by {len(subjects)} subjects" if subjects else "no placed user"
    moves, taken = [], set(found)
    for name, subject in sorted(subject_of.items()):
        kind = name.split("\\")[1]
        if subject is None or kind not in MOVABLE:
            continue
        new = target(name, subject)
        if new == name:
            continue
        if new in taken:
            left[name] = f"{new} is taken"
            continue
        taken.add(new)
        moves.append(f"{name} {new}")
    print("\n".join(moves))
    for name, why in sorted(left.items()):
        if name.split("\\")[1] in MOVABLE:
            print(f"{name} stays: {why}", file=sys.stderr)


main()
