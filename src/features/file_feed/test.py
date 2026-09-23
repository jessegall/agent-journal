import json

from controllers.types import Agents
from features.file_feed.feed import edits_since
from tests.conftest import fresh
from tests.kit import report


def agent_on(transcript, provider):
    record = fresh()
    report(record, "working", "PostToolUse", provider=provider, transcript=str(transcript), cwd=str(transcript.parent))
    return Agents(record, actor="system").by_session("claude-1")


def test_claude_edits_become_cards_and_the_cursor_reads_only_what_came_after(tmp_path):
    transcript = tmp_path / "s.jsonl"
    result = lambda key, at, outcome: json.dumps({"type": "user", "timestamp": at, "toolUseResult": outcome,
                                                  "message": {"content": [{"type": "tool_result", "tool_use_id": key}]}}) + "\n"
    patch = [{"oldStart": 3, "newStart": 3, "lines": [" a", "-b", "+B", "+C"]}, {"oldStart": 40, "newStart": 41, "lines": [" x", "-y"]}]
    transcript.write_text(result("t1", "2026-09-23T10:00:00Z", {"filePath": str(tmp_path / "src/a.py"), "oldString": "b", "structuredPatch": patch})
                          + json.dumps({"type": "user", "toolUseResult": {"stdout": "structuredPatch"}}) + "\n")
    row = agent_on(transcript, "claude")
    first = edits_since(row, 0)
    card = first.edits[0]
    assert (card.path, card.added, card.removed, card.first_line, card.last_line) == ("src/a.py", 2, 2, 3, 41), "one card per edit, counted and placed"
    assert [(r.kind, r.line, r.hidden) for r in card.rows] == [("ctx", 3, 0), ("del", 4, 0), ("add", 4, 0), ("add", 5, 0), ("fold", None, 35),
                                                              ("ctx", 41, 0), ("del", 41, 0)], "the unchanged lines between hunks fold to one row"
    with transcript.open("a") as out:
        out.write(result("t2", "2026-09-23T10:01:00Z", {"type": "create", "filePath": str(tmp_path / "new.py"), "content": "one\ntwo", "structuredPatch": []}))
    after = edits_since(row, first.cursor)
    assert [(c.id, c.kind, [r.kind for r in c.rows]) for c in after.edits] == [("t2", "new", ["add", "add"])], "a new file is all added lines"


def test_a_codex_deleted_file_is_one_line_with_its_removed_count(tmp_path):
    transcript = tmp_path / "rollout.jsonl"
    changes = {str(tmp_path / "old.md"): {"type": "delete", "content": "a\nb\nc"}}
    transcript.write_text(json.dumps({"type": "event_msg", "timestamp": "2026-09-23T10:00:00Z", "payload": {
        "type": "item_completed", "item": {"type": "FileChange", "id": "e1", "status": "completed", "changes": changes}}}) + "\n")
    card = edits_since(agent_on(transcript, "codex"), 0).edits[0]
    assert (card.kind, card.removed, card.rows) == ("deleted", 3, ()), "a deleted file carries no diff rows"
