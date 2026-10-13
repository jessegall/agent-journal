from resources.base import Summary


def counts(controller, rows: list[Summary] | None = None) -> dict:
    every, opened, unread = controller.rows.counts("overview", rows)
    return {"all": every, "open": opened, "unread": unread}
