from engine.memo import Memo
from resources.base import USER

TALLIED = Memo()


def counts(controller) -> dict:
    summaries = controller.rows.summaries()
    return TALLIED.get((str(controller.record.home), controller.type), summaries, lambda: tally(summaries))


def tally(summaries: list) -> dict:
    found = {"all": 0, "open": 0, "unread": 0}
    for row in summaries:
        if row["deleted"] or row.get("hidden"):
            continue
        found["all"] += 1
        if not row["completed"]:
            found["open"] += 1
            found["unread"] += USER not in (row.get("seen") or [])
    return found
