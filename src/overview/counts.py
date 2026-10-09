from resources.base import USER


def weigh(row: dict) -> tuple[int, int, int]:
    """What one row adds to a type's counts: itself, whether it is open, and whether it is open and unread by the user."""
    if row["deleted"] or row.get("hidden"):
        return (0, 0, 0)
    opened = not row["completed"]
    return (1, int(opened), int(opened and USER not in (row.get("seen") or [])))


def counts(controller, rows: list[dict] | None = None) -> dict:
    every, opened, unread = controller.rows.counted("overview", weigh, 3, rows)
    return {"all": every, "open": opened, "unread": unread}
