import json
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from engine.transcript import page, conversation, search, user  # noqa: E402
from providers import PROVIDERS  # noqa: E402
from tests.kit import check, done  # noqa: E402

folder = Path(tempfile.mkdtemp())

# CLAUDE: user and assistant rows, text blocks, sidechains skipped, compaction summaries marked
claude = folder / "s.jsonl"
rows = [
    {"type": "user", "origin": {"kind": "human"}, "timestamp": "2026-09-18T10:00:00Z", "message": {"content": "fix the header"}},
    {"type": "assistant", "timestamp": "2026-09-18T10:00:01Z", "message": {"content": [{"type": "text", "text": "on it"}, {"type": "tool_use", "name": "Bash"}]}},
    {"type": "user", "isSidechain": True, "message": {"content": "a subagent's prompt"}},
    {"type": "system", "content": "compacted"},
    {"type": "user", "isCompactSummary": True, "message": {"content": "Summary: the header was fixed"}},
    {"type": "user", "origin": {"kind": "human"}, "message": {"content": "now the footer"}},
    {"type": "assistant", "message": {"content": [{"type": "text", "text": "the footer is done"}]}},
    {"type": "user", "isCompactSummary": True, "message": {"content": "Summary: footer done"}},
    {"type": "user", "origin": {"kind": "human"}, "message": {"content": "thanks"}},
]
claude.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
turns = PROVIDERS["claude"]().transcript(claude)
check("the turns, with their line numbers, who spoke and the text", [(t.line, t.who, t.text) for t in turns],
      [(1, "user", "fix the header"), (2, "agent", "on it"), (5, "summary", "Summary: the header was fixed"), (6, "user", "now the footer"), (7, "agent", "the footer is done"), (8, "summary", "Summary: footer done"), (9, "user", "thanks")])
check("search: newest first, with line numbers as citations", [(t.line, t.text) for t in search(turns, "footer")], [(8, "Summary: footer done"), (7, "the footer is done"), (6, "now the footer")])
check("conversation --back=1: the stretch the last summary replaced", [t.text for t in conversation(turns, 1)], ["now the footer", "the footer is done"])
check("conversation --back=2: the stretch before that", [t.text for t in conversation(turns, 2)], ["fix the header", "on it"])
check("user: the user's own words", [t.text for t in user(turns)], ["fix the header", "now the footer", "thanks"])
check("Claude kinds, tools and times", (turns[0].kind, turns[0].at, turns[1].kind, turns[1].tools),
      ("human", 1789725600.0, "agent", ["Bash"]))
check("a missing file is no transcript", PROVIDERS["claude"]().transcript(folder / "none.jsonl"), [])

claude.write_text("\n".join(json.dumps(r) for r in [
    {"type": "user", "parentUuid": "p", "origin": {"kind": "human"}, "message": {"content": "do it yhough"}},
    {"type": "user", "parentUuid": "p", "origin": {"kind": "human"}, "message": {"content": "do it though"}},
    {"type": "user", "userType": "external", "message": {"content": "an older user prompt"}},
    {"type": "user", "userType": "external", "isMeta": True, "message": {"content": "injected context"}},
    {"type": "assistant", "message": {"content": [{"type": "tool_use", "id": "q1", "name": "AskUserQuestion", "input": {"questions": [{"question": "Which?", "options": [{"label": "A"}, {"label": "B"}]}]}}]}},
    {"type": "user", "message": {"content": [{"type": "tool_result", "tool_use_id": "q1", "content": "A"}]}},
    {"type": "user", "message": {"content": [{"type": "tool_result", "tool_use_id": "other", "content": "output"}]}},
]) + "\n")
turns = PROVIDERS["claude"]().transcript(claude)
check("edited prompts, questions, answers and ordinary tool results keep their kinds",
      [(t.kind, t.who, t.text, t.tools) for t in turns],
      [("superseded", "user", "do it yhough", []), ("human", "user", "do it though", []),
       ("human", "user", "an older user prompt", []), ("injected", "injected", "injected context", []),
       ("agent", "agent", "asked: Which?  [A / B]", ["AskUserQuestion"]),
       ("human", "user", "A", []), ("tool", "tool", "output", [])])

# CODEX: the rollout's user_message and agent_message events
codex = folder / "rollout.jsonl"
codex.write_text("\n".join(json.dumps(r) for r in [
    {"type": "session_meta", "payload": {"id": "x"}},
    {"type": "response_item", "timestamp": "2026-09-18T10:00:00Z", "payload": {"type": "message", "role": "user", "content": [{"type": "input_text", "text": "run the probe"}]}},
    {"type": "response_item", "timestamp": "2026-09-18T10:00:01Z", "payload": {"type": "custom_tool_call", "name": "exec"}},
    {"type": "response_item", "timestamp": "2026-09-18T10:00:02Z", "payload": {"type": "custom_tool_call_output", "output": [{"type": "input_text", "text": "ok"}]}},
    {"type": "response_item", "payload": {"type": "reasoning"}},
    {"type": "response_item", "timestamp": "2026-09-18T10:00:03Z", "payload": {"type": "message", "role": "assistant", "content": [{"type": "output_text", "text": "PROBE-SEEN"}]}},
    {"type": "response_item", "payload": {"type": "message", "role": "user", "content": [{"type": "input_text", "text": "<environment_context>cwd</environment_context>"}]}},
]) + "\n")
turns = PROVIDERS["codex"]().transcript(codex)
check("Codex messages, tools, output, injected context and times",
      [(t.who, t.kind, t.text, t.tools) for t in turns],
      [("user", "human", "run the probe", []), ("agent", "agent", "", ["Bash"]),
       ("tool", "tool", "ok", []), ("agent", "agent", "PROBE-SEEN", []),
       ("user", "injected", "<environment_context>cwd</environment_context>", [])])
check("Codex timestamp", turns[1].at, 1789725601.0)
check("paging keeps stable line citations, clips text and caps requested page size",
      page(turns, before=turns[-1].line, size=2, cap=3),
      {"total": 5, "first": 2, "turns": [
          {"line": 4, "who": "tool", "kind": "tool", "at": 1789725602.0, "tools": [], "text": "ok", "clipped": False},
          {"line": 6, "who": "agent", "kind": "agent", "at": 1789725603.0, "tools": [], "text": "PRO", "clipped": True},
      ]})

done()
