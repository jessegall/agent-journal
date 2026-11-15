import json
import os
from pathlib import Path

from core.modules.agents.support.base_commands import BASE_COMMANDS
from engine.helper_type.helper_type_entry import HelperTypeEntry
from engine.helper_type.journal_line import JournalLine
from engine.journal.journal_home import JournalHome
from engine.module.journal_lines import JournalLines
from engine.module.module_finder import ModuleFinder

TABLE_FILE = Path(__file__).resolve().parents[5] / "tests" / "snapshots" / "command_lists.json"
UPDATE_FLAG = "JOURNAL_UPDATE_COMMAND_LISTS"
ALLOWED = "allowed"
REFUSED = "refused"


def current_table(tmp_path: Path) -> dict[str, dict[str, str]]:
    finder = ModuleFinder(JournalHome(tmp_path))
    modules, suites = finder.default_modules(), finder.suite_list()
    types = sorted((HelperTypeEntry.declared(module.name, declaration) for module in modules for declaration in suites.helper_types(module)), key=lambda entry: entry.key)
    return {line: {entry.key: ALLOWED if BASE_COMMANDS.joined(entry.commands).allows(JournalLine(line, classes)) else REFUSED for entry in types}
            for line, classes in sorted(JournalLines().classes(modules).items())}


def undecided_lines(recorded: dict[str, dict[str, str]], current: dict[str, dict[str, str]]) -> list[str]:
    return [f"{line} {key}: recorded {recorded.get(line, {}).get(key)}, now {decision}" for line, decisions in current.items() for key, decision in decisions.items()
            if recorded.get(line, {}).get(key) != decision]


def test_every_journal_line_has_a_decision_for_every_helper_type(tmp_path):
    current = current_table(tmp_path)
    if os.environ.get(UPDATE_FLAG):
        TABLE_FILE.write_text(json.dumps(current, indent=1) + "\n")
    recorded = json.loads(TABLE_FILE.read_text())
    assert not undecided_lines(recorded, current), "\n".join(undecided_lines(recorded, current))


def test_a_line_with_no_decision_is_named_with_the_type():
    assert undecided_lines({}, {"shelf stock": {"worker": REFUSED}}) == ["shelf stock worker: recorded None, now refused"]
