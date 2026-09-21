import pytest

import features
from controllers.types import Pins, Rules
from engine.hooks import handle, whispered
from providers import PROVIDERS
from resources.base import USER
from tests.conftest import fresh, refused


@pytest.fixture(autouse=True)
def loaded_features():
    features.unload()
    features.load()
    yield
    features.unload()


def test_a_command_that_touches_a_rules_keyword_is_whispered_the_rule_once_per_session():
    claude = PROVIDERS["claude"]()
    record = fresh()

    def use(tool, given, session="claude-1"):
        return handle(claude, record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": session, "tool_name": tool, "tool_input": given})

    def said(session="claude-1"):
        return whispered(record, session)

    rule = Rules(record, actor=USER).create("Never change the git branch", brief="A branch change belongs to the user", keywords=["git checkout", "git switch"])
    pin = Pins(record, actor=USER).create("The viewer is built from web/", brief="web/dist is what the server serves", keywords=["npm run build"])

    assert (use("Bash", {"command": "ls -la"}), said()) == ({}, ""), "a command with none of the words says nothing"
    assert use("Bash", {"command": "git checkout -b spike"}).get("hookSpecificOutput", {}).get("permissionDecision") is None, \
        "a command carrying a rule's word is not refused"
    assert said() == f"rule {rule.n} — Never change the git branch — A branch change belongs to the user", \
        "and the rule is whispered, naming it and its reasoning"

    use("Bash", {"command": "git checkout main"})
    assert said() == "", "the same rule is not said twice to the same session"
    use("Bash", {"command": "git checkout main"}, session="claude-2")
    assert said("claude-2").startswith(f"rule {rule.n} —") is True, "another session hears it once of its own"

    use("Write", {"file_path": "notes.md", "content": "then npm run build"})
    assert said().startswith(f"pin {pin.n} —") is True, "a pin whose word is in what is being written is whispered"

    Rules(record, actor=USER).create("Write clean code")
    use("Bash", {"command": "write clean code"})
    assert said() == "", "a row with no keywords is never whispered"

    assert ("keywords" in type(rule).fields) is True, "keywords are a field of the type, not loose data"
    Rules(record, actor=USER).set(rule.n, "keywords", '["git checkout", "git rebase"]')
    assert Rules(record).load(rule.n).data["keywords"] == ["git checkout", "git rebase"], "set reads a list the same way --set does"
    Rules(record, actor=USER).set(rule.n, "keywords", "git checkout, git rebase")
    assert Rules(record).load(rule.n).data["keywords"] == ["git checkout", "git rebase"], "plain words are read as the list they plainly are"
    Rules(record, actor=USER).set(rule.n, "keywords", "git checkout")
    assert Rules(record).load(rule.n).data["keywords"] == ["git checkout"], "one word is a list of one"
    assert ("keywords is a list" in refused(lambda: Rules(record, actor=USER).set(rule.n, "keywords", "7"))) is True, \
        "something that is no kind of list is refused"
