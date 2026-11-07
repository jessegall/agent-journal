DOCUMENT_ROWS_SELECT = (
    "SELECT 'doc:' || id AS row_key, 'doc' AS row_type, id, title, abstract, close_reason, updated_at FROM docs"
    " UNION ALL"
    " SELECT 'report:' || id AS row_key, 'report' AS row_type, id, title, abstract, close_reason, updated_at FROM reports"
)
