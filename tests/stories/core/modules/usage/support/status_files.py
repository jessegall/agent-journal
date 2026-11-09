import json
import os

FIVE_HOURS_RESET = 1793545200
SEVEN_DAYS_RESET = 1793876400
REWRITE_STEP_NS = 1_000_000_000


def save_status_file(story, session: str, report: dict[str, object]) -> None:
    """The status file Claude Code's status line leaves for a session, as the hook program keeps it."""
    story.home.status_folder.mkdir(parents=True, exist_ok=True)
    (story.home.status_folder / f"{session}.json").write_text(json.dumps({"session_id": session, **report}))


def keep_status_file(story, session: str) -> None:
    """The program has not rewritten the status file yet: it keeps its reading and its modified time."""
    path = story.home.status_folder / f"{session}.json"
    assert path.is_file(), f"no status file for {session} to keep"


def rewrite_status_file(story, session: str, tokens: int) -> None:
    """The program rewrote the status file with a new reading, modified later than any earlier one."""
    path = story.home.status_folder / f"{session}.json"
    earlier_ns = path.stat().st_mtime_ns if path.is_file() else 0
    save_status_file(story, session, {"context_window": {"total_input_tokens": tokens}})
    os.utime(path, ns=(earlier_ns + REWRITE_STEP_NS, earlier_ns + REWRITE_STEP_NS))


def full_status(story, session: str, percent: int, spent_usd: float) -> None:
    save_status_file(story, session, {"model": {"display_name": "Opus"}, "context_window": {"used_percentage": percent}, "cost": {"total_cost_usd": spent_usd},
                                  "rate_limits": {"five_hour": {"used_percentage": 30, "resets_at": FIVE_HOURS_RESET},
                                                  "seven_day": {"used_percentage": 65, "resets_at": SEVEN_DAYS_RESET}}})
