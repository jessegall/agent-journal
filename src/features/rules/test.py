from controllers.types import Facts, Nudges, Rules
from features.journal_laws.policy import BEGIN, END, brief
from runner.hooks import handle
from providers import PROVIDERS
from resources.base import AGENT, USER
from tests.conftest import fresh, refused
from tests.kit import nudges, report


def test_a_command_that_touches_a_rules_keyword_is_whispered_the_rule_once_per_session():
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
    assert text() == f"rule {rule.n} — Never change the git branch — A branch change belongs to the user", \
        "and the rule is whispered, naming it and its reasoning"

    use("Bash", {"command": "git checkout main"})
    assert text() == "", "the same rule is not said again within 100 tool uses"
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


def test_inject_and_uninject_change_the_rules_in_the_one_block_and_pin_notices_the_rule():
    record = fresh()
    rules = Rules(record, actor=USER)
    rules.create("name the model on every dispatch", keywords="word")

    claude_md = record.root.parent / "CLAUDE.md"
    agents_md = record.root.parent / "AGENTS.md"
    claude_md.write_text("# My project\n\nkeep this.\n")
    agents_md.write_text("keep this too.\n")
    rules.inject(1)
    assert (rules.load(1).injected, claude_md.read_text().startswith(f"# My project\n\n{BEGIN}\n"), agents_md.read_text().startswith(f"{BEGIN}\n"),
            all(path.read_text().endswith(f"## Rules\n\n- name the model on every dispatch\n\n{END}\n\n{kept}\n")
                for path, kept in ((claude_md, "keep this."), (agents_md, "keep this too.")))) == (True, True, True, True), \
        "inject puts the rule in the one block, which leads both files under their title"
    rules.update(1, title="name the model on every subagent dispatch")
    assert all("- name the model on every subagent dispatch\n" in path.read_text() and path.read_text().count(BEGIN) == 1 for path in (claude_md, agents_md)) is True, \
        "a change rewrites the one block in both files"
    rules.uninject(1)
    assert (rules.load(1).injected, "## Rules" in claude_md.read_text(), claude_md.read_text().endswith(f"{END}\n\nkeep this.\n")) == (False, False, True), \
        "uninject takes the rule out and keeps the law and the project's text"
    notice = rules.pin(1)
    assert (notice.title, notice.refs, notice.data["link"], notice.data["label"]) == \
        ("name the model on every subagent dispatch", ["rule:1"], "#/t/rule/1", "Open rule"), \
        "pin puts the rule over chat and links it"
    assert rules.pin(1).n == notice.n, "pin keeps one standing notice per rule"


def test_the_briefing_retires_the_old_blocks_and_leaves_a_file_it_cannot_read_safely():
    record = fresh()
    project = record.root.parent
    Rules(record, actor=USER).inject(Rules(record, actor=USER).create("only rule", keywords="word").n)
    old = ("# Notes\n\nfirst part.\n\n<!-- BEGIN: agent-journal (auto-generated, run `journal update`) -->\nB1\n<!-- END: agent-journal -->\n\n"
           "<!-- BEGIN: agent-journal law (auto-generated, run `journal upgrade`) -->\nL1\n<!-- END: agent-journal law -->\n\nmiddle.\n\n"
           "<!-- journal rules -->\n# Rules\n\n- old rule\n<!-- /journal rules -->\n\nlast part.\n")
    (project / "AGENTS.md").write_text(old)
    (project / "CLAUDE.md").write_text(old)
    first = brief(project, record)
    text = (project / "AGENTS.md").read_text()
    assert (len(first.written), text.startswith(f"# Notes\n\n{BEGIN}\n"), text.endswith(f"- only rule\n\n{END}\n\nfirst part.\n\nmiddle.\n\nlast part.\n"),
            "B1" in text or "old rule" in text) == (2, True, True, False), "the three old blocks become one block at the head, the project's text kept in order"
    assert brief(project, record).written == (), "a file already right is not written again"

    left = {"lone": "a\n<!-- journal rules -->\nb\n", "conflicted": "a\n<<<<<<< ours\nb\n=======\nc\n>>>>>>> theirs\n",
            "newer": "<!-- BEGIN: agent-journal, form 9 (auto-generated, run `journal upgrade`) -->\nx\n<!-- END: agent-journal, form 9 -->\n"}
    for name, had in left.items():
        (project / "AGENTS.md").write_text(had)
        assert ((project / "AGENTS.md").read_text(), len(brief(project, record).left)) == (had, 1), f"a {name} file is left as it is and named"

    empty = fresh()
    Rules(empty, actor=USER).inject(Rules(empty, actor=USER).create("only rule", keywords="word").n)
    assert [(empty.root.parent / name).read_text().startswith(f"# {empty.root.parent.name}\n\n{BEGIN}\n") for name in ("AGENTS.md", "CLAUDE.md")] == [True] * 2, \
        "no instruction files yet: both are made with the block under the project's name"


def test_a_rule_the_agent_makes_is_sent_back_to_be_read_as_a_ruling_for_the_whole_project():
    record = fresh()
    report(record, "working", "PreToolUse")
    made = Rules(record, actor=AGENT).create("Run the dashboard warm-up in this worktree", keywords=["dashboard"])
    assert f"Is rule {made.n} a ruling for the whole project?" in nudges(record), "the agent is asked whether its rule binds every environment"
    Rules(record, actor=USER).create("Never change the git branch", keywords=["git switch"])
    assert len([n for n in nudges(record) if n.startswith("Is rule")]) == 1, "a rule the user makes is not sent back"
