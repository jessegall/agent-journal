def counts(controller, rows: list[dict] | None = None) -> dict:
    every, opened, unread = controller.rows.counts("overview", rows)
    return {"all": every, "open": opened, "unread": unread}
