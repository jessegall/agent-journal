MAIN_ROLE = "main"
MAIN_NAME = "Main agent"


def agent_name_sql(alias: str) -> str:
    """The SQL text that names the agent row an alias stands for as the code names it: Main agent, or its role
    and its number, such as Worker 848."""
    return (f"CASE WHEN {alias}.role = '{MAIN_ROLE}' THEN '{MAIN_NAME}'"
            f" ELSE upper(substr({alias}.role, 1, 1)) || substr({alias}.role, 2) || ' ' || {alias}.number END")
