from engine.database.migration import Migration


class DecisionIndexesMigration(Migration):
    """Indexes the decisions by outcome and time, for the tasks each rule gave lately and its last skip, and by
    rule, for whether a rule ever matched."""

    number = 2
    statements = ("CREATE INDEX assign_decisions_outcome_time ON assign_decisions (outcome, updated_at)",
                  "CREATE INDEX assign_decisions_rule ON assign_decisions (rule_id)")
