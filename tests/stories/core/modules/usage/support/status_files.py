import json

FIVE_HOURS_RESET = 1793545200
SEVEN_DAYS_RESET = 1793876400


def save_status_file(story, session: str, report: dict[str, object]) -> None:
    """The status file Claude Code's status line leaves for a session, as the hook program keeps it."""
    story.home.status_folder.mkdir(parents=True, exist_ok=True)
    (story.home.status_folder / f"{session}.json").write_text(json.dumps({"session_id": session, **report}))


def full_status(story, session: str, percent: int, spent_usd: float) -> None:
    save_status_file(story, session, {"model": {"display_name": "Opus"}, "context_window": {"used_percentage": percent}, "cost": {"total_cost_usd": spent_usd},
                                  "rate_limits": {"five_hour": {"used_percentage": 30, "resets_at": FIVE_HOURS_RESET},
                                                  "seven_day": {"used_percentage": 65, "resets_at": SEVEN_DAYS_RESET}}})
