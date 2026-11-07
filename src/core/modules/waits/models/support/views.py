WAITING_ROWS_SELECT = (
    "SELECT waits.id, waits.focus, waits.state, waits.opened_at,"
    " coalesce((SELECT group_concat(wait_targets.row_table || ':' || wait_targets.row_id, ', ') FROM wait_targets WHERE wait_targets.wait_id = waits.id), '') AS targets"
    " FROM waits"
    " WHERE waits.state = 'open' AND (waits.type = 'help_request'"
    " OR EXISTS (SELECT 1 FROM wait_targets WHERE wait_targets.wait_id = waits.id AND wait_targets.row_table = 'questions'))"
)
