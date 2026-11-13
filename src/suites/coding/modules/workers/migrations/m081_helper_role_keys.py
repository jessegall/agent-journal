from engine.database.migration import Migration


class HelperRoleKeysMigration(Migration):
    """Stores the keys of the helper classes: a verifier or a reviewer becomes a helper, keeping its number,
    history and end, and a helper started with the merger profile becomes a merger. Each statement selects only
    rows of an old key, so a run that stopped half way, or a second run, writes no row twice."""

    number = 81
    statements = ["UPDATE agents SET role = 'helper' WHERE role IN ('verifier', 'reviewer')",
                  "UPDATE agents SET role = 'merger' WHERE role = 'helper' AND profile = 'journal-merger'"]
