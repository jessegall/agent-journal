import re
from collections.abc import Sequence
from pathlib import Path

import pytest

from engine.helper_type.command_allow_list import CommandAllowList
from engine.module.model_declaration import ALL_SUBCOMMANDS
from core.modules.agents.support.base_commands import BASE_COMMANDS
from core.modules.helpers.types.helper_commands import HelperCommands
from suites.coding.modules.workers.types.merger_commands import MergerCommands
from suites.coding.modules.workers.types.worker_commands import WorkerCommands
from suites.coding.support.shipped_profiles import HELPER_SKILLS, MERGER_PROFILE, MERGER_SKILLS, RESEARCHER_PROFILE, WORKER_PROFILE, WORKER_SKILLS

SOURCE = Path(__file__).resolve().parents[5] / "src"
JOURNAL_LINE = re.compile(r"journal ([a-z][a-z-]*) ([a-z][a-z-]*)")
CLI_NAME = re.compile(r'^\s*cli_name = "([a-z-]+)"', re.MULTILINE)
VERB_NAME = re.compile(r'^\s*name = "([a-z-]+)"', re.MULTILINE)
# the verbs a read-only helper's class of reading lines passes whatever the subject
READING_VERBS = {"show", "list", "read", "overview", "context", "find", "inspect", "info", "comments", "status", "next", "logs", "graph", "tags", "current", "board", "outline", "timeline"}

# the commands a type's skills and profile text name that its list refuses, with the reason: a skill every agent loads
# also names what the main agent or a person runs, and the lists of the helper types leave those out on purpose
SHARED_SKILL = "a skill every agent loads names it for the main agent or a person"
REFUSED = {
    "worker": dict.fromkeys(['alias add', 'alias skip', 'check run', 'doc close', 'doc open', 'doc revision', 'doc revisions', 'doc settle', 'link list', 'link remove', 'merger tell',
                             'message clear-work-source', 'message tag', 'message work-from', 'message work-source', 'question ask', 'question list', 'question show', 'reader readable',
                             'reader-request waive', 'refusal approve', 'refusal decline', 'reminder make', 'rule make', 'sequence list', 'sequence make', 'sequence show', 'task depend',
                             'task next'], SHARED_SKILL),
    "merger": dict.fromkeys(['agent driver', 'agent limits', 'agent mix', 'agent retire', 'agent sessions', 'alias add', 'alias skip', 'doc revision', 'doc revisions', 'doc settle',
                             'helper lifetimes', 'helper send', 'helper start', 'helper stop', 'message clear-work-source', 'message reports', 'message tag', 'message work-from',
                             'message work-source', 'plan focus', 'question ask', 'reader add', 'reader draft', 'reader readable', 'reader unreadable', 'reader-request waive',
                             'refusal approve', 'refusal decline', 'rule make', 'setting request', 'task block', 'task focus', 'task tag', 'worker ask-merge', 'worker dispatch',
                             'worker models', 'worker presets', 'worker release', 'worker report', 'worker sandbox', 'worker send', 'worker split'], SHARED_SKILL),
    "helper": dict.fromkeys(['agent driver', 'agent limits', 'agent mix', 'agent retire', 'agent sessions', 'alias add', 'alias skip', 'doc revision', 'doc revisions', 'doc settle',
                             'helper lifetimes', 'helper send', 'helper start', 'helper stop', 'merger tell', 'message clear-work-source', 'message reports', 'message tag',
                             'message work-from', 'message work-source', 'plan focus', 'question ask', 'reader add', 'reader draft', 'reader readable', 'reader unreadable',
                             'reader-request waive', 'refusal approve', 'refusal decline', 'rule make', 'task block', 'task focus', 'task tag', 'worker report'], SHARED_SKILL),
}


def journal_commands() -> set[tuple[str, str]]:
    """Every journal subject and verb the source declares: a subcommand's cli_name and name, and the verbs every model has."""
    commands: set[tuple[str, str]] = set()
    for path in SOURCE.rglob("*_subcommand.py"):
        text = path.read_text(errors="ignore")
        subjects, verbs = CLI_NAME.findall(text), VERB_NAME.findall(text)
        commands.update((subject, verb) for subject in subjects for verb in verbs)
    for path in SOURCE.rglob("*.py"):
        text = path.read_text(errors="ignore")
        if "ModelDeclaration(" in text:
            commands.update((subject, verb) for subject in CLI_NAME.findall(text) for verb in ALL_SUBCOMMANDS)
    return commands


def skill_text(name: str) -> str:
    return "\n".join(path.read_text() for path in SOURCE.rglob(f"skills/{name}/SKILL.md"))


def named_commands(skills: Sequence[str], profile_text: str, declared: set[tuple[str, str]]) -> set[str]:
    text = "\n".join([profile_text, *(skill_text(name) for name in skills)])
    return {f"{subject} {verb}" for subject, verb in JOURNAL_LINE.findall(text) if (subject, verb) in declared}


def refused_by(commands: CommandAllowList, named: set[str], is_reading: bool) -> list[str]:
    """The named commands the list neither lists by group or by line nor passes by its class of reading lines."""
    refused = []
    for line in sorted(named):
        subject, verb = line.split(" ")
        if subject in commands.groups or line in commands.lines or (is_reading and verb in READING_VERBS):
            continue
        refused.append(line)
    return refused


TYPES = {
    "worker": (BASE_COMMANDS.joined(WorkerCommands()), WORKER_SKILLS, WORKER_PROFILE.body, False),
    "merger": (BASE_COMMANDS.joined(HelperCommands().joined(MergerCommands())), MERGER_SKILLS, MERGER_PROFILE.body, True),
    "helper": (BASE_COMMANDS.joined(HelperCommands()), HELPER_SKILLS, RESEARCHER_PROFILE.body, True),
}


@pytest.mark.parametrize("type_name", sorted(TYPES))
def test_every_command_the_skills_and_profile_of_a_helper_type_name_passes_its_list_or_is_refused_for_a_reason(type_name):
    commands, skills, profile_text, is_reading = TYPES[type_name]
    refused = refused_by(commands, named_commands(skills, profile_text, journal_commands()), is_reading)
    unexplained = [line for line in refused if line not in REFUSED[type_name]]
    assert not unexplained, f"{type_name}: add each to its list, or to REFUSED with the reason its skills name it: {unexplained}"


def test_a_command_dropped_from_a_list_is_found_by_the_check():
    commands = WorkerCommands()
    named = {"task show", "proof make"}
    assert refused_by(commands, named, False) == []
    dropped = CommandAllowList(commands.categories, commands.groups, tuple(line for line in commands.lines if line != "task show"), commands.classes)
    assert refused_by(dropped, named, False) == ["task show"]
