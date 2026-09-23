from controllers.types import Facts, Nudges, Rules
from engine.hooks import handle
from providers import PROVIDERS
from resources.base import AGENT, USER
from tests.conftest import fresh, refused
from tests.kit import nudges, report


def test_a_command_that_touches_a_rules_keyword_is_whispered_the_rule_once_per_window():
    claude = PROVIDERS["claude"]()
    record = fresh()

    def use(tool, given, session="claude-1"):
        return handle(claude, record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": session, "tool_name": tool, "tool_input": given})

    received = set()

    def text(session="claude-1"):
        fresh_nudges = [n for n in Nudges(record, actor=AGENT)._every() if n.data.get("session") == session and n.n not in received]
        received.update(n.n for n in fresh_nudges)
        return "\n".join(n.agent_line() for n in fresh_nudges)

    rule = Rules(record, actor=USER).create("Never change the git branch", brief="A branch change belongs to the user", keywords=["git checkout", "git switch"])
    pin = Facts(record, actor=USER).create("The viewer is built from web/", brief="web/dist is what the server serves", keywords=["npm run build"])

    assert (use("Bash", {"command": "ls -la"}), text()) == ({}, ""), "a command with none of the words says nothing"
    assert use("Bash", {"command": "git checkout -b spike"}).get("hookSpecificOutput", {}).get("permissionDecision") is None, \
        "a command carrying a rule's word is not refused"
    assert text() == f"rule {rule.n} — Never change the git branch", "and the rule is whispered by its title, without its reasoning"

    use("Bash", {"command": "git checkout main"})
    assert text() == "", "the same rule is not said twice in one context window"
    from controllers.types import Agents
    from resources.base import SYSTEM
    first = Agents(record, actor=SYSTEM).by_session("claude-1")
    Agents(record, actor=SYSTEM).update(first.n, compactions=[{"at": 1.0}])
    use("Bash", {"command": "git checkout main"})
    assert text() == f"rule {rule.n} — Never change the git branch", "after a compaction, a new context window hears it again"
    use("Bash", {"command": "git checkout main"}, session="claude-2")
    assert text("claude-2").startswith(f"rule {rule.n} —") is True, "another session hears it once of its own"

    use("Write", {"file_path": "notes.md", "content": "then npm run build"})
    assert text().startswith(f"fact {pin.n} —") is True, "a fact whose word is in what is being written is whispered"

    Rules(record, actor=USER).create("Write clean code", keywords="word")
    use("Bash", {"command": "write clean code"})
    assert text() == "", "a row with no keywords is never whispered"

    assert ("keywords" in type(rule).fields) is True, "keywords are a field of the type, not loose data"
    Rules(record, actor=USER).set(rule.n, "keywords", '["git checkout", "git rebase"]')
    assert Rules(record).load(rule.n).data["keywords"] == ["git checkout", "git rebase"], "set reads a list the same way --set does"
    Rules(record, actor=USER).set(rule.n, "keywords", "git checkout, git rebase")
    assert Rules(record).load(rule.n).data["keywords"] == ["git checkout", "git rebase"], "plain words are read as the list they plainly are"
    Rules(record, actor=USER).set(rule.n, "keywords", "git checkout")
    assert Rules(record).load(rule.n).data["keywords"] == ["git checkout"], "one word is a list of one"
    assert ("keywords is a list" in refused(lambda: Rules(record, actor=USER).set(rule.n, "keywords", "7"))) is True, \
        "something that is no kind of list is refused"


def test_standing_rules_are_repeated_at_every_quarter_and_a_struck_rule_drops_out():
    record = fresh()
    rules = Rules(record, actor=USER)
    rules.create("name the model on every dispatch", keywords="word")
    rules.create("a title never explains with a colon", keywords="word")
    for pct in (10, 24, 25, 40, 49.5, 50, 80):
        report(record, "working", "PostToolUse", context=pct)
    assert [n for n in nudges(record) if "in force" in n] == ["2 rules in force, read them"] * 3, "said at 25, 50 and 80: the standing rules by number"
    assert Nudges(record).load(1).brief == "1. name the model on every dispatch; 2. a title never explains with a colon", \
        "the words carry the rules"
    rules.complete(2, "retired")
    report(record, "working", "PostToolUse", context=100)
    assert [n for n in nudges(record) if "in force" in n][-1] == "1 rule in force, read them", "a struck rule is not said"


def test_inject_writes_and_uninject_restores_both_instruction_files_and_pin_notices_the_rule():
    record = fresh()
    rules = Rules(record, actor=USER)
    rules.create("name the model on every dispatch", keywords="word")

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
    Rules(empty, actor=USER).inject(Rules(empty, actor=USER).create("only rule", keywords="word").n)
    assert [(empty.root.parent / name).read_text() for name in ("AGENTS.md", "CLAUDE.md")] == \
        ["<!-- journal rules -->\n# Rules\n\n- only rule\n<!-- /journal rules -->\n"] * 2, \
        "no instruction files yet: both get the block"
