from controllers.types import Helpers


def still_unreported(journal, rows: tuple[str, ...]) -> bool:
    return any(row.ref in rows and not (row.report or row.stopped_by_user) for row in journal.get(Helpers).rows.standing())


def report_waits(journal, rows: tuple[str, ...]) -> bool:
    """A helper's report is named while it stands: helper say, which gives the helper new work, clears it, and so does finishing the helper."""
    return any(row.ref in rows and row.report for row in journal.get(Helpers).rows.standing())


def helper_waits_on_question(journal, rows: tuple[str, ...]) -> bool:
    helpers = journal.get(Helpers)
    return any(row.ref in rows and helpers.open_questions(row.environment) for row in helpers.rows.standing())


