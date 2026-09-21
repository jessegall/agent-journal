import pytest

import features
from controllers.types import Nudges, Rules
from resources.base import USER
from tests.kit import nudges, report
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_standing_rules_are_repeated_at_every_tenth_and_a_struck_rule_drops_out():
    record = fresh()
    rules = Rules(record, actor=USER)
    rules.create("name the model on every dispatch")
    rules.create("a title never explains with a colon")
    for pct in (4, 9, 10, 15, 19.5, 20, 33):
        report(record, "working", "PostToolUse", context=pct)
    assert nudges(record) == ["2 rules in force, read them"] * 3, "said at 10, 20 and 33: the standing rules by number"
    assert Nudges(record).load(1).brief == "1. name the model on every dispatch; 2. a title never explains with a colon", \
        "the words carry the rules"
    rules.complete(2, "retired")
    report(record, "working", "PostToolUse", context=41)
    assert nudges(record)[-1] == "1 rule in force, read them", "a struck rule is not said"


def test_inject_writes_and_uninject_restores_both_instruction_files_and_pin_notices_the_rule():
    record = fresh()
    rules = Rules(record, actor=USER)
    rules.create("name the model on every dispatch")

    claude_md = record.root.parent / "CLAUDE.md"
    agents_md = record.root.parent / "AGENTS.md"
    claude_md.write_text("# My project\n\nkeep this.\n")
    agents_md.write_text("# Agents\n\nkeep this too.\n")
    rules.inject(1)
    assert (rules.load(1).injected, claude_md.read_text(), agents_md.read_text()) == \
        (True, "# My project\n\nkeep this.\n\n<!-- journal rules -->\n# Rules\n\n- name the model on every dispatch\n<!-- /journal rules -->\n",
         "# Agents\n\nkeep this too.\n\n<!-- journal rules -->\n# Rules\n\n- name the model on every dispatch\n<!-- /journal rules -->\n"), \
        "inject marks the rule and writes the block under both files"
    rules.update(1, title="name the model on every subagent dispatch")
    assert all("- name the model on every subagent dispatch\n" in path.read_text() and path.read_text().count("journal rules") == 2 for path in (claude_md, agents_md)) is True, \
        "a change rewrites both instruction blocks"
    rules.uninject(1)
    assert (rules.load(1).injected, claude_md.read_text(), agents_md.read_text()) == \
        (False, "# My project\n\nkeep this.\n", "# Agents\n\nkeep this too.\n"), "uninject restores both instruction files"
    notice = rules.pin(1)
    assert (notice.title, notice.refs, notice.data["link"], notice.data["label"]) == \
        ("name the model on every subagent dispatch", ["rule:1"], "#/t/rule/1", "Open rule"), \
        "pin puts the rule over chat and links it"
    assert rules.pin(1).n == notice.n, "pin keeps one standing notice per rule"

    empty = fresh()
    Rules(empty, actor=USER).inject(Rules(empty, actor=USER).create("only rule").n)
    assert [(empty.root.parent / name).read_text() for name in ("AGENTS.md", "CLAUDE.md")] == \
        ["<!-- journal rules -->\n# Rules\n\n- only rule\n<!-- /journal rules -->\n"] * 2, \
        "no instruction files yet: both get the block"
