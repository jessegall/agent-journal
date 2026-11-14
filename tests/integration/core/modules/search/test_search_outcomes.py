import json
from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.time.clock import Clock
from core.modules.search.support.search_outcomes import SearchOutcomes

AGENT_ID = 4
OLD_HIT = {"cli_name": "task", "row_id": 1, "created_at": "2026-11-12T10:00:00+00:00", "excerpt": "Install plan", "matched_terms": 2, "rank": 0}


def test_a_kept_search_written_before_hits_stored_their_words_is_left_unread_and_the_search_runs_again(tmp_path: Path):
    home = JournalHome(tmp_path / ".journal")
    clock = Clock()
    outcomes = SearchOutcomes(home, clock)
    file = outcomes.file(AGENT_ID)
    file.parent.mkdir(parents=True)
    file.write_text(json.dumps({"terms": ["install", "plan"], "models": [], "total": 1, "is_closest": True, "hits": [OLD_HIT], "kept_at": clock.timestamp().text}))
    assert outcomes.read_once(AGENT_ID, ["install", "plan"], []) is None
