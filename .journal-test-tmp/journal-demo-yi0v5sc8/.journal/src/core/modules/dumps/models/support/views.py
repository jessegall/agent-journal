DUMP_ROWS_SELECT = (
    "SELECT 'dump:' || dumps.id AS row_key, 'dump' AS row_type, dumps.id AS dump_id, 0 AS item_id, 0 AS position,"
    " dumps.title, dumps.brief, dumps.outcome, '' AS text, '' AS state, '' AS note, '' AS summary, '[]' AS refs FROM dumps"
    " UNION ALL"
    " SELECT 'item:' || dump_items.id, 'item', dumps.id, dump_items.id, dump_items.position,"
    " '', '', '', dump_items.text, dump_items.state, dump_items.note, dump_items.summary, dump_items.refs"
    " FROM dump_items JOIN dumps ON dumps.id = dump_items.dump_id"
)
