import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from v2.engine.transcript import conversation, search, user  # noqa: E402
from v2.providers import PROVIDERS  # noqa: E402
from v2.tests.kit import check, done  # noqa: E402

folder = Path(tempfile.mkdtemp())

# CLAUDE: user and assistant rows, text blocks, sidechains skipped, compaction summaries marked
claude = folder / "s.jsonl"
rows = [
    {"type": "user", "message": {"content": "fix the header"}},
    {"type": "assistant", "message": {"content": [{"type": "text", "text": "on it"}, {"type": "tool_use", "name": "Bash"}]}},
    {"type": "user", "isSidechain": True, "message": {"content": "a subagent's prompt"}},
    {"type": "system", "content": "compacted"},
    {"type": "user", "isCompactSummary": True, "message": {"content": "Summary: the header was fixed"}},
    {"type": "user", "message": {"content": "now the footer"}},
    {"type": "assistant", "message": {"content": [{"type": "text", "text": "the footer is done"}]}},
    {"type": "user", "isCompactSummary": True, "message": {"content": "Summary: footer done"}},
    {"type": "user", "message": {"content": "thanks"}},
]
claude.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
turns = PROVIDERS["claude"]().transcript(claude)
check("the turns, with their line numbers, who spoke and the text", [(t.line, t.who, t.text) for t in turns],
      [(1, "user", "fix the header"), (2, "agent", "on it"), (5, "summary", "Summary: the header was fixed"), (6, "user", "now the footer"), (7, "agent", "the footer is done"), (8, "summary", "Summary: footer done"), (9, "user", "thanks")])
check("search: newest first, with line numbers as citations", [(t.line, t.text) for t in search(turns, "footer")], [(8, "Summary: footer done"), (7, "the footer is done"), (6, "now the footer")])
check("conversation --back=1: the stretch the last summary replaced", [t.text for t in conversation(turns, 1)], ["now the footer", "the footer is done"])
check("conversation --back=2: the stretch before that", [t.text for t in conversation(turns, 2)], ["fix the header", "on it"])
check("user: the user's own words", [t.text for t in user(turns)], ["fix the header", "now the footer", "thanks"])
check("a missing file is no transcript", PROVIDERS["claude"]().transcript(folder / "none.jsonl"), [])

# CODEX: the rollout's user_message and agent_message events
codex = folder / "rollout.jsonl"
codex.write_text("\n".join(json.dumps(r) for r in [
    {"type": "session_meta", "payload": {"id": "x"}},
    {"type": "event_msg", "payload": {"type": "user_message", "message": "run the probe"}},
    {"type": "response_item", "payload": {"type": "reasoning"}},
    {"type": "event_msg", "payload": {"type": "agent_message", "message": "PROBE-SEEN"}},
]) + "\n")
check("codex turns from the rollout", [(t.who, t.text) for t in PROVIDERS["codex"]().transcript(codex)], [("user", "run the probe"), ("agent", "PROBE-SEEN")])

done()
