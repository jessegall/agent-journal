DOCUMENT_ROWS_SELECT = (
    "SELECT 'doc:' || id AS row_key, 'doc' AS kind, id, title, abstract, updated_at FROM docs"
    " UNION ALL"
    " SELECT 'report:' || id AS row_key, 'report' AS kind, id, title, abstract, updated_at FROM reports"
)
