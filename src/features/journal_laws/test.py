import json
from contextlib import chdir
from pathlib import Path


import features
from engine import bus
from events.answers import Refused
from events.asking import ToolCallAsked
from runner.hooks import handle
from features.session_briefing.start import start_block
from features.journal_laws.briefing import BEGIN, brief
from providers import PROVIDERS
from tests.conftest import fresh
from tests.kit import nudges, report


def test_the_law_is_fixed_on_and_carried_by_every_start():
    record = fresh()
    law = features.FEATURES["journal_laws"]
    assert (law.enabled(record), law.describe()["fixed"]) == (True, True), "the law is fixed on"
    record.features = {"journal_laws": False}
    assert law.enabled(record) is True, "a setting cannot switch the law off"
    assert all(name in start_block(record) for name in ("L1", "L2", "L3", "L4", "L5", "L6")) is True, "every start carries every law"


def test_the_briefing_writes_both_agent_files_preserving_project_text(tmp_path):
    record = fresh()
    project = record.root.parent
    (project / "CLAUDE.md").write_text("# Kept\n")
    assert [f.name for f in brief(project, record).written] == ["AGENTS.md", "CLAUDE.md"], "the briefing writes both agent files"
    assert (project / "CLAUDE.md").read_text().startswith("# Kept\n") is True, "the briefing preserves project text"
    assert ((project / "CLAUDE.md").read_text().count(BEGIN), "@AGENTS.md" in (project / "CLAUDE.md").read_text().splitlines(), (project / "AGENTS.md").read_text().count(BEGIN)) == (0, True, 1), \
        "the journal's block is written once, into AGENTS.md, and CLAUDE.md imports it"
    (project / "relative").mkdir()
    with chdir(project / "relative"):
        brief(Path("."), record)
    assert (project / "relative" / "AGENTS.md").read_text().splitlines()[0] == f"# {(project / 'relative').name}", \
        "a relative project path still names its briefing"
    (project / "AGENTS.md").write_text((project / "AGENTS.md").read_text().replace("least expensive", "edited"))
    brief(project, record)
    assert ((project / "AGENTS.md").read_text().count(BEGIN), "edited" in (project / "AGENTS.md").read_text()) == (1, False), \
        "the managed block is restored once"
    (project / "CLAUDE.md").write_text((project / "CLAUDE.md").read_text() + f"\n{BEGIN}\nold copy\n<!-- END: agent-journal, form 2 -->\n")
    brief(project, record)
    assert ((project / "CLAUDE.md").read_text().count(BEGIN), (project / "CLAUDE.md").read_text().count("@AGENTS.md")) == (0, 1), "a copy of the block left in CLAUDE.md is taken out, and the import stays once"
    odd = tmp_path / "odd"
    odd.mkdir()
    (odd / "CLAUDE.md").write_bytes("\ufeff# Marked\n".encode())
    (odd / "AGENTS.md").symlink_to("CLAUDE.md")
    brief(odd, record)
    assert ((odd / "AGENTS.md").is_symlink(), (odd / "CLAUDE.md").read_bytes().startswith("\ufeff# Marked\n".encode())) == (True, True), \
        "a linked AGENTS.md stays a link and a byte-order mark stays first"
    (odd / "CLAUDE.md").write_bytes(b"# Latin \xe9\n")
    assert [line.split(":")[1].strip() for line in brief(odd, record).left] == ["it is not UTF-8 text"] * 2, "a file that is not UTF-8 is left as it is"
    from controllers.types import Sequences
    from features.sequences.shipped import ship
    ship(record)
    started = lambda: handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "SessionStart", "session_id": "s-check"})
    checking = lambda: next(r for r in Sequences(record).all() if r.title == "Checking the instruction files")
    started()
    assert len(checking().runs) == 0, "a start never runs the instruction check by itself"
    from controllers.types import Rules
    from resources.base import USER
    Rules(record, actor=USER).inject(Rules(record, actor=USER).create("never deploy on Fridays", keywords="deploy").n)
    started()
    (project / "CLAUDE.md").write_text((project / "CLAUDE.md").read_text() + "\nNever deploy on Mondays.\n")
    started()
    assert len(checking().runs) == 0, \
        "nor does the block gaining a rule or the project's own text changing: the installer rewrites both files on every upgrade, so a check that started itself ran again and again for a change nobody made"
    assert checking().data.get("starts_on", "").startswith("trigger:"), "it is still started by asking for it, through the trigger that watches for the words"


def test_a_dispatch_is_an_event_a_plugin_can_cancel_even_when_the_laws_allow_it():
    from controllers.types import Plugins
    from features import load
    from framework.plugins.paths import folder, home
    from resources.base import SYSTEM
    load()
    record = fresh()
    where = folder(record.root, "quiet")
    home(record.root).mkdir(parents=True, exist_ok=True)
    where.mkdir(parents=True, exist_ok=True)
    (where / "cancel.sh").write_text("cat > /dev/null; echo '{\"cancel\": \"no subagents during the demo\"}'")
    for name, enabled in (("switched-off", False), ("unbothered", True)):
        folder(record.root, name).mkdir(parents=True, exist_ok=True)
        (folder(record.root, name) / "cancel.sh").write_text("cat > /dev/null; echo '{}'")
        Plugins(record, actor=SYSTEM).create(name, enabled=enabled, token="t0ken", settings={}, manifest={"name": name, "cancels": {"agent.dispatching": "sh cancel.sh"}})
    Plugins(record, actor=SYSTEM).create("quiet", enabled=True, token="t0ken", settings={}, manifest={"name": "quiet", "cancels": {"agent.dispatching": "sh cancel.sh"}})
    hook = lambda tool, given: handle(PROVIDERS["claude"](), record.root, record.env, {"hook_event_name": "PreToolUse", "session_id": "claude-cancel", "tool_name": tool, "tool_input": given})
    refused = hook("Agent", {"subagent_type": "Explore", "model": "haiku", "description": "Nikola Tesla: map the hooks"})
    assert refused.get("decision") == "block" and "no subagents during the demo" in refused.get("reason", ""), refused
    assert hook("Read", {"file_path": "a.py"}).get("decision") != "block", "only the dispatch is asked about"


def test_a_long_command_output_keeps_its_ends_and_the_whole_of_it_as_an_output_row(tmp_path):
    import subprocess
    import sys
    from pathlib import Path
    from agents.terminal import output_cap, session_named
    from features import load
    from controllers.journal_laws import Outputs
    from providers import PROVIDERS
    load()
    record = fresh()
    src = Path(__file__).resolve().parents[2]
    shim = tmp_path / "journal"
    shim.write_text(f'#!/bin/sh\nexec "{sys.executable}" "{src / "journal.py"}" --root "{record.root}" --env "{record.env}" "$@"\n')
    shim.chmod(0o755)
    from controllers.types import Agents
    agent = Agents(record).by_session("session-1")
    env = {"PATH": f"{tmp_path}:/usr/bin:/bin", "JOURNAL_OUTPUT_LINES": "3", "JOURNAL_OUTPUT_DIR": str(tmp_path / "outputs"),
           **PROVIDERS["claude"]().shell_wrapper(src / "output_cap.sh"), **session_named(PROVIDERS["claude"]()), "JOURNAL_PROVIDER": "claude",
           "CLAUDE_CODE_SESSION_ID": "session-1"}
    wrapped = "source /dev/null 2>/dev/null || true && eval 'seq 1 1000; echo '\"'\"'done'\"'\"' >/dev/null; exit 3' < /dev/null && pwd -P >| /dev/null"
    ran = subprocess.run([str(src / "output_cap.sh"), wrapped], capture_output=True, text=True, env=env, timeout=30)
    assert (ran.returncode, ran.stdout.splitlines()[:3], ran.stdout.splitlines()[-3:]) == (3, ["1", "2", "3"], ["998", "999", "1000"]), ran.stdout + ran.stderr
    cut = ran.stdout.splitlines()[3]
    assert "994 lines cut here" in cut and "output 1," in cut, cut
    row = Outputs(record).load(1)
    kept = Path(cut.split(" at ", 1)[1].split(": grep", 1)[0])
    assert (row.title, row.data["lines"], kept.read_text().split()) == ("seq 1 1000; echo 'done' >/dev/null; exit 3", 1000, [str(i) for i in range(1, 1001)]), row
    card = Agents(record).load(agent.n).data["cards"][-1]
    assert card["label"] == "Cut 994 of 1,000 lines from a long output, kept whole as output 1" and card["command"] == row.title, card
    short = subprocess.run([str(src / "output_cap.sh"), wrapped.replace("seq 1 1000", "seq 1 5")], capture_output=True, text=True, env=env, timeout=20)
    assert short.stdout.split() == ["1", "2", "3", "4", "5"] and Outputs(record).rows.numbers() == [1], "short output passes whole and keeps no row"
    server = subprocess.run([str(src / "output_cap.sh"), "seq 1 1000"], capture_output=True, text=True, env=env, timeout=20)
    assert len(server.stdout.splitlines()) == 1000 and Outputs(record).rows.numbers() == [1], "an MCP server Claude starts through the prefix is never capped"
    Outputs(record).force_delete(1)
    assert not kept.exists(), "a pruned output takes its file with it"
    launched = output_cap(record.root, record.env, PROVIDERS["claude"]())
    assert launched["JOURNAL_PROVIDER"] == "claude" and launched["CLAUDE_CODE_SHELL_PREFIX"] == str(record.root / "src" / "output_cap.sh") and launched["JOURNAL_OUTPUT_LINES"] == "200", launched
    assert output_cap(record.root, record.env, PROVIDERS["codex"]()) == {}, "codex has no shell prefix and caps its own output"
    record.set_setting("journal_laws", {"output_lines": 0})
    assert output_cap(record.root, record.env, PROVIDERS["claude"]()) == {}, "0 keeps every line"
    from tests.conftest import refused
    outputs = Outputs(record)
    direct = tmp_path / "direct.txt"
    direct.write_text("a\nb\nc\n")
    assert "no such file" in refused(lambda: outputs.store(str(tmp_path / "missing.txt"))), "an output that is not there cannot be kept"
    number = int(outputs.store(str(direct), "  cat   notes: x ", "session-1", 1).split()[0])
    assert (outputs.load(number).title, outputs.load(number).data["lines"], direct.exists()) == ("cat notes x", 3, False), \
        "a kept output is titled by its command on one line, counts its lines and moves its file into the row"
    assert "Cut 2 of 3 lines" in Agents(record).load(agent.n).data["cards"][-1]["label"], "the agent that ran it sees how much was cut"


def test_the_naming_law_follows_the_chosen_style():
    from controllers.form_of_address.controller import Profiles, ship
    from resources.voices import CARTOON
    from features.journal_laws.laws import carry, laws
    from resources.base import SYSTEM
    record = fresh()
    ship(record)
    assert "Dr. Einstein" in carry(record) and "Lady Lovelace" in carry(record), \
        "until a profile is chosen, agents are named as the Butler names them: historical figures with a twist on their trade"
    own = Profiles(record, actor=SYSTEM).create("Mine", brief="Talk plainly.", sample="Yes.", naming=CARTOON.text)
    record.set_setting("form_of_address", {"profile": str(own.n)})
    assert "a cartoon character" in start_block(record) and "Dora the Explorer" in dict((law.name, law.text) for law in laws(record))["L5"], \
        "the law every session is handed names agents in the style of the profile in use"
    assert "addresses you as Sam and never the user" in dict((law.name, law.text) for law in laws(record))["L5"], \
        "and tells every helper and subagent to address the agent by the profile's name, never the user"


def test_an_instruction_file_past_its_providers_limit_is_told_once_per_size_band():
    record = fresh()
    agents_md = record.root.parent / "AGENTS.md"
    agents_md.write_text("x" * 200_000)
    report(record, "working", "PreToolUse", provider="claude")
    assert not [n for n in nudges(record) if n.startswith("AGENTS.md is")], "a Claude agent is not told about Codex's file"
    report(record, "working", "PreToolUse", provider="codex")
    report(record, "working", "PreToolUse", provider="codex")
    assert [n for n in nudges(record) if n.startswith("AGENTS.md is")] == [f"AGENTS.md is 200,000 bytes and Codex reads only its first {PROVIDERS['codex'].briefing_limit():,}"], \
        "the file past Codex's limit is told once"
    agents_md.write_text("x" * 210_000)
    report(record, "working", "PreToolUse", provider="codex")
    assert len([n for n in nudges(record) if n.startswith("AGENTS.md is")]) == 2, "growing by another band tells it again"
    agents_md.write_text("x" * 100)
    (record.root.parent / "app").mkdir()
    (record.root.parent / "app" / "AGENTS.md").write_text("y" * 200_000)
    report(record, "working", "PreToolUse", cwd=str(record.root.parent / "app"), provider="codex")
    assert any(n.startswith("AGENTS.md with app/AGENTS.md is 200,100 bytes") for n in nudges(record)), \
        "every AGENTS.md Codex reads on the way to its working folder counts against the one budget"
def test_a_file_dropped_in_a_dump_is_read_whole():
    record = fresh()
    dropped = record.folder("dump") / "001" / "proposal.md"
    dropped.parent.mkdir(parents=True)
    dropped.write_text("x = 1\n" * 800)
    asked = ToolCallAsked(tool="Read", input=json.dumps({"file_path": str(dropped)}), session="claude-1")
    assert not isinstance(bus.asked(asked, record), Refused), "a file dropped in a dump is read whole, however long"


