ASSIGNED_ACTOR_SQL = "(SELECT assignments.actor_id FROM assignments WHERE assignments.subject_model = '{model}' AND assignments.subject_id = {row_id} LIMIT 1)"
