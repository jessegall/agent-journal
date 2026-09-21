import pytest

import features
from controllers.types import Docs, Facts, Rules, Todos, Works
from engine.queries import carry, start_block, status
from engine.hooks import handle
from providers import PROVIDERS
from resources.base import AGENT, USER
from tests.conftest import fresh


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_the_start_block_names_the_environment_rules_pins_work_docs_and_todos():
    record = fresh()
    f = record.root / "runtime" / f"start-{record.env}.md"
    Rules(record, actor=USER).create("name the model on every dispatch")
    Facts(record, actor=AGENT).create("v2 imports nothing old")
    Works(record, actor=AGENT).create("the header")
    Docs(record, actor=AGENT).create("The engine", abstract="the loop from A to Z")
    Todos(record, actor=USER).create("later")
    block = f.read_text()
    assert block == start_block(record), "every write rewrites the start block"
    assert [line for line in block.splitlines() if line and not line.startswith("  ")] == \
        ["THE JOURNAL IS IN FORCE HERE — this session is bound to environment `t`.", "LAWS THE JOURNAL SHIPS, always in force:",
         "STILL OPEN, from this or an earlier session (1):", "RULES, in force on every environment (1):", "PINS on this environment (1):",
         "DOCS catalogued — read one before you re-investigate what it settles (1):", "1 TO-DOS waiting — delayed work, not an instruction to start any of it."], \
        "it says the environment, the rules, the pins, the open work, the docs and the count of to-dos"
    assert "    1  The engine  (the loop from A to Z)" in block, "a doc line carries its abstract"

    provider = PROVIDERS["claude"]()
    out = handle(provider, record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "s-1"})
    assert (out["hookSpecificOutput"]["additionalContext"] == f.read_text() and out["hookSpecificOutput"]["hookEventName"]) == "SessionStart", \
        "SessionStart returns the file as context"
    assert handle(provider, record.root, record.env, {"hook_event_name": "Stop", "session_id": "s-1"}) == {}, \
        "other events hand nothing over"

    assert status(record).splitlines()[0] == "JOURNAL  environment t", "status counts what stands, by type"
    assert (carry(record).startswith(start_block(record)) and "RULE 1  name the model" in carry(record)) is True, \
        "carry is the block and every standing thing in full"
