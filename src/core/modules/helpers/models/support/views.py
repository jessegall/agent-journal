AGENT_TYPE_TERM = "coalesce(nullif(agents.profile, ''), agents.role)"
AGENT_MODEL_TERM = "coalesce(nullif(agents.program_model, ''), 'default')"
JOB_COUNTS_SELECT = (
    f"SELECT {AGENT_TYPE_TERM}, {AGENT_MODEL_TERM}, count(*) FROM {{work_source}} AS work JOIN agents ON agents.id = work.{{agent_column}}"
    f" WHERE work.created_at > ? AND work.{{agent_column}} IS NOT NULL AND agents.role <> 'main' AND (? IS NULL OR agents.environment_id = ?) GROUP BY 1, 2"
)


def job_counts_select(work_source: str, agent_column: str) -> str:
    return JOB_COUNTS_SELECT.format(work_source=work_source, agent_column=agent_column)
