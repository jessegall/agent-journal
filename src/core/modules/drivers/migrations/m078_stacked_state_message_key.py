from engine.database.migration import Migration


class StackedStateMessageKeyMigration(Migration):
    """A Blocked state kept on an agent's stack names its line's key agent_message_key, as the state's field does."""

    number = 78
    statements = ["UPDATE agent_stacks SET stacked_states = replace(stacked_states, '\"nudge_key\":', '\"agent_message_key\":')"
                  " WHERE stacked_states LIKE '%\"nudge_key\":%'"]
