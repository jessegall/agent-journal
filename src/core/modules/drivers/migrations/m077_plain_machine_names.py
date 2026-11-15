from engine.database.migration import Migration


class PlainMachineNamesMigration(Migration):
    """Gives the agent machine's stored tables and columns the plain names its code uses: a hook's event id, the
    stack's stacked states, the session and work numbers, the driver and program versions and the hidden states."""

    number = 77
    statements = [
        "ALTER TABLE hook_calls RENAME COLUMN firing TO event_id",
        "ALTER TABLE admission_receipts RENAME COLUMN firing TO event_id",
        "ALTER TABLE agent_blocks RENAME COLUMN opening_firing TO opening_event_id",
        "ALTER TABLE driver_grants RENAME COLUMN spending_firing TO spending_event_id",
        "ALTER TABLE agent_launches RENAME COLUMN session_generation TO session_number",
        "ALTER TABLE agent_wakes RENAME COLUMN session_generation TO session_number",
        "ALTER TABLE agent_wakes RENAME COLUMN work_generation TO work_number",
        "ALTER TABLE agent_stacks RENAME COLUMN frame_schema TO stacked_state_schema",
        "ALTER TABLE agent_stacks RENAME COLUMN frames TO stacked_states",
        "UPDATE agent_stacks SET stacked_states = replace(stacked_states, '\"need_key\":', '\"state_key\":')",
        "ALTER TABLE agent_stack_moves RENAME COLUMN frame_key TO stacked_state_key",
        "ALTER TABLE agent_stack_moves RENAME COLUMN frame_end TO stacked_state_end",
        "ALTER TABLE agent_frame_suppressions RENAME COLUMN need_key TO state_key",
        "ALTER TABLE agent_frame_suppressions RENAME TO hidden_states",
        "ALTER TABLE driver_epochs RENAME TO driver_versions",
        "ALTER TABLE program_epochs RENAME TO program_versions",
    ]
