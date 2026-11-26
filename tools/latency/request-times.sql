-- How long the driver requests of one operation took since a moment: staged for the worker until applied.
-- psql -v operation=deliver -v since="'2026-11-26 20:00'" -f request-times.sql
SELECT :'operation' AS operation,
       count(*) AS requests,
       round(percentile_cont(0.5) WITHIN GROUP (ORDER BY took_ms)) AS median_ms,
       round(percentile_cont(0.95) WITHIN GROUP (ORDER BY took_ms)) AS percentile_95_ms,
       max(script_step) AS most_script_steps
FROM (
    SELECT extract(epoch FROM (updated_at - staged_at)) * 1000 AS took_ms, script_step
    FROM driver_requests
    WHERE operation = :'operation' AND progress = 'applied' AND staged_at IS NOT NULL AND created_at >= :since
) AS timed;
