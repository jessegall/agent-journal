from engine.database.migration import Migration


class SequenceStepsWithinLimitMigration(Migration):
    """Cuts every sequence step longer than 600 characters, which an upgrade from version 4 could bring, to 600
    with an ellipsis, so the sequence reads again and the listeners that load it stop refusing its events."""

    number = 10
    statements = [
        "UPDATE sequences SET steps = (SELECT json_group_array(fitted) FROM (SELECT CASE WHEN length(value) > 600 THEN substr(value, 1, 599) || '…'"
        " ELSE value END AS fitted FROM json_each(sequences.steps) ORDER BY key))"
        " WHERE EXISTS (SELECT 1 FROM json_each(sequences.steps) WHERE length(value) > 600)",
    ]
