from controllers.types import Rules
from features.journal_laws.briefing import BEGIN, END, brief
from resources.base import USER
from tests.conftest import fresh, refused


def test_a_rules_keywords_are_a_field_read_as_a_list():
    record = fresh()
    rule = Rules(record, actor=USER).create("Never change the git branch", brief="A branch change belongs to the user", keywords=["git checkout", "git switch"])
    assert ("keywords" in type(rule).fields) is True, "keywords are a field of the type, not loose data"
    Rules(record, actor=USER).set(rule.n, "keywords", '["git checkout", "git rebase"]')
    assert Rules(record).load(rule.n).data["keywords"] == ["git checkout", "git rebase"], "set reads a list the same way --set does"
    Rules(record, actor=USER).set(rule.n, "keywords", "git checkout, git rebase")
    assert Rules(record).load(rule.n).data["keywords"] == ["git checkout", "git rebase"], "plain words are read as the list they plainly are"
    Rules(record, actor=USER).set(rule.n, "keywords", "git checkout")
    assert Rules(record).load(rule.n).data["keywords"] == ["git checkout"], "one word is a list of one"
    assert ("keywords is a list" in refused(lambda: Rules(record, actor=USER).set(rule.n, "keywords", "7"))) is True, \
        "something that is no kind of list is refused"


def test_inject_and_uninject_change_the_rules_in_the_one_block_and_pin_notices_the_rule():
    record = fresh()
    rules = Rules(record, actor=USER)
    rules.create("name the model on every dispatch", keywords="word")

    claude_md = record.root.parent / "CLAUDE.md"
    agents_md = record.root.parent / "AGENTS.md"
    claude_md.write_text("# My project\n\nkeep this.\n")
    agents_md.write_text("keep this too.\n")
    rules.inject(1)
    assert (rules.load(1).injected, claude_md.read_text(), agents_md.read_text().startswith(f"{BEGIN}\n"),
            agents_md.read_text().endswith(f"## Rules\n\n- name the model on every dispatch\n\n{END}\n\nkeep this too.\n")) == (True, "# My project\n\n@AGENTS.md\n\nkeep this.\n", True, True), \
        "inject puts the rule in the one block, in AGENTS.md, which CLAUDE.md imports"
    rules.update(1, title="name the model on every subagent dispatch")
    assert ("- name the model on every subagent dispatch\n" in agents_md.read_text(), agents_md.read_text().count(BEGIN), claude_md.read_text().count(BEGIN)) == (True, 1, 0), \
        "a change rewrites the one block, in AGENTS.md"
    rules.uninject(1)
    assert (rules.load(1).injected, "## Rules" in agents_md.read_text(), agents_md.read_text().endswith(f"{END}\n\nkeep this too.\n")) == (False, False, True), \
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
    assert (len(first.written), text.startswith(f"# Notes\n\n{BEGIN}\n"), text.endswith(f"- only rule\n\n{END}\n\nfirst part.\n\n\n\n\n\nmiddle.\n\n\n\nlast part.\n"),
            "B1" in text or "old rule" in text) == (2, True, True, False), "the three old blocks become one block at the head, the project's text kept in order"
    assert brief(project, record).written == (), "a file already right is not written again"
    spaced = "# Notes\n\n\n  indented, with trailing spaces   \n\n\n\nend without a newline"
    (project / "AGENTS.md").write_text(spaced)
    brief(project, record)
    written = (project / "AGENTS.md").read_text()
    assert (written.endswith(f"{END}\n" + spaced.removeprefix("# Notes\n")), brief(project, record).written) == (True, ()), \
        "the project's own text is kept byte for byte, and a second write changes nothing"
    crlf = ("# Notes\r\n\r\nfirst  \r\n<!-- journal rules -->\r\nold\r\n<!-- /journal rules -->\r\n\r\nlast\r\n")
    (project / "AGENTS.md").write_bytes(crlf.encode())
    brief(project, record)
    kept = (project / "AGENTS.md").read_bytes()
    assert kept.endswith(b"first  \r\n\r\n\r\nlast\r\n") and b"\n" not in kept.replace(b"\r\n", b""), "CRLF and the bytes around a retired block survive"

    left = {"lone": "a\n<!-- journal rules -->\nb\n", "lone current": "a\n<!-- BEGIN: agent-journal, form 2 (auto-generated, run `journal upgrade`) -->\nb\n", "conflicted": "a\n<<<<<<< ours\nb\n=======\nc\n>>>>>>> theirs\n",
            "newer": "<!-- BEGIN: agent-journal, form 9 (auto-generated, run `journal upgrade`) -->\nx\n<!-- END: agent-journal, form 9 -->\n"}
    for name, had in left.items():
        (project / "AGENTS.md").write_text(had)
        assert ((project / "AGENTS.md").read_text(), len(brief(project, record).left)) == (had, 1), f"a {name} file is left as it is and named"

    empty = fresh()
    Rules(empty, actor=USER).inject(Rules(empty, actor=USER).create("only rule", keywords="word").n)
    assert ((empty.root.parent / "AGENTS.md").read_text().startswith(f"# {empty.root.parent.name}\n\n{BEGIN}\n"), (empty.root.parent / "CLAUDE.md").read_text()) == (True, "@AGENTS.md\n"), \
        "no instruction files yet: AGENTS.md is made with the block under the project's name, and CLAUDE.md imports it"
