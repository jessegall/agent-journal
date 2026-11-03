HOOK_REQUEST_ROWS_SELECT = """
SELECT id,
       json_extract(payload, '$.received_at') AS received_at,
       json_extract(payload, '$.program') AS program,
       payload -> '$.headers' AS headers_json,
       payload -> '$.body' AS body_json,
       json_extract(payload, '$.duration_ms') AS duration_ms,
       json_extract(payload, '$.outcome') AS outcome,
       coalesce(json_extract(payload, '$.body.event'), json_extract(payload, '$.body.hook_event_name'), 'hook') AS event,
       coalesce(json_extract(payload, '$.body.tool.name'), json_extract(payload, '$.body.tool_name'), '') AS tool,
       substr(json_extract(payload, '$.received_at'), 1, 10) AS day,
       substr(json_extract(payload, '$.received_at'), 12, 12) AS time,
       lag(substr(json_extract(payload, '$.received_at'), 1, 10)) OVER (ORDER BY id DESC)
           IS NOT substr(json_extract(payload, '$.received_at'), 1, 10) AS day_start
FROM hook_requests
"""
