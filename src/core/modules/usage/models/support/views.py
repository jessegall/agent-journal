AGENT_CARDS_SELECT = (
    "SELECT agents.id, agents.environment_id, agents.session, agents.role, agents.program, agents.program_model, agents.profile, agents.given_name, agents.paused_at, agents.ended_at,"
    " (SELECT tasks.id FROM tasks WHERE tasks.holder_id = agents.id AND tasks.state = 'started' ORDER BY tasks.id DESC LIMIT 1) AS started_task_id,"
    " coalesce((SELECT tasks.title FROM tasks WHERE tasks.holder_id = agents.id AND tasks.state = 'started' ORDER BY tasks.id DESC LIMIT 1), '') AS started_task_title,"
    " (SELECT json_group_array(json_object('id', listed.id, 'title', listed.title, 'state', listed.state)) FROM ("
    "SELECT tasks.id, tasks.title, tasks.state, 0 AS part FROM tasks WHERE agents.role = 'worker' AND tasks.holder_id = agents.id AND coalesce(tasks.delegated_to, 0) != agents.id"
    " UNION ALL SELECT tasks.id, tasks.title, tasks.state, 0 AS part FROM tasks WHERE agents.role != 'worker' AND tasks.id ="
    " (SELECT started.id FROM tasks AS started WHERE started.holder_id = agents.id AND started.state = 'started' ORDER BY started.id DESC LIMIT 1)"
    " UNION ALL SELECT tasks.id, tasks.title, tasks.state, 1 AS part FROM tasks WHERE tasks.delegated_to = agents.id"
    " ORDER BY part, id) AS listed) AS tasks,"
    " EXISTS (SELECT 1 FROM agent_blocks WHERE agent_blocks.agent_id = agents.id AND agent_blocks.closed_at IS NULL) AS is_blocked,"
    " coalesce(dispatch.program_model, '') AS dispatch_model, coalesce(dispatch.profile, '') AS dispatch_profile,"
    " coalesce(dispatch.description, '') AS dispatch_description, coalesce(dispatch.instruction, '') AS dispatch_instruction"
    " FROM agents"
    " LEFT JOIN subagent_dispatches AS dispatch ON dispatch.id = (SELECT min(subagent_dispatches.id) FROM subagent_dispatches WHERE subagent_dispatches.subagent_id = agents.id)"
)

AGENT_LISTING_SELECT = (
    "SELECT agent_cards.*, agents.parent_id, agents.created_at, agents.updated_at, agents.process_started_at"
    " FROM agent_cards JOIN agents ON agents.id = agent_cards.id"
)
