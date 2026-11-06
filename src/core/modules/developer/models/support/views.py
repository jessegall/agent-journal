HOOK_REQUEST_ROWS_SELECT = """
SELECT id,
       json_extract(payload, '$.received_at') AS received_at,
       json_extract(payload, '$.program') AS program,
       payload -> '$.headers' AS headers_json,
       payload -> '$.body' AS body_json,
       json_extract(payload, '$.duration_ms') AS duration_ms,
       coalesce(json_extract(payload, '$.queued_ms'), 0) AS queued_ms,
       CASE json_extract(payload, '$.role')
           WHEN 'viewer' THEN 'Viewer'
           WHEN 'cli' THEN 'Command line'
           WHEN 'worker' THEN 'Worker' || CASE WHEN coalesce(json_extract(payload, '$.agent'), '') <> '' THEN ': ' || json_extract(payload, '$.agent') ELSE '' END
           WHEN 'helper' THEN 'Helper' || CASE WHEN coalesce(json_extract(payload, '$.agent'), '') <> '' THEN ': ' || json_extract(payload, '$.agent') ELSE '' END
           ELSE 'Main agent'
       END AS sender,
       json_extract(payload, '$.outcome') AS outcome,
       coalesce(json_extract(payload, '$.body.event'), json_extract(payload, '$.body.hook_event_name'), 'hook') AS event,
       coalesce(json_extract(payload, '$.body.tool.name'), json_extract(payload, '$.body.tool_name'), '') AS tool,
       coalesce(json_array_length(payload, '$.body.tool.shell.parts'), 0) AS part_count,
       substr(json_extract(payload, '$.received_at'), 1, 10) AS day,
       substr(json_extract(payload, '$.received_at'), 12, 12) AS time,
       lag(substr(json_extract(payload, '$.received_at'), 1, 10)) OVER (ORDER BY id DESC)
           IS NOT substr(json_extract(payload, '$.received_at'), 1, 10) AS day_start
FROM hook_requests
"""
