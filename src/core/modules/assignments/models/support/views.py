def assigned_actor_sql(model_name: str, id_column: str) -> str:
    return f"(SELECT assignments.actor_id FROM assignments WHERE assignments.subject_model = '{model_name}' AND assignments.subject_id = {id_column} LIMIT 1)"
