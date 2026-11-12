from engine.agent.agent_name import AgentName

ACTIVE_MEMORIES_SELECT = (
    "SELECT memories.id AS memory_id, memories.environment_id, memories.agent_id, memories.text, memories.weight"
    " FROM memories WHERE memories.state = 'active' AND memories.weight > 0"
)

MEMORY_HOLDERS_SELECT = (
    "SELECT agents.id AS agent_id, agents.environment_id, agents.role, " + AgentName.sql("agents") + " AS name, agents.created_at AS started_at, agents.ended_at,"
    " counts.active_memories, counts.removed_memories FROM agents JOIN (SELECT agent_id, sum(state = 'active') AS active_memories,"
    " sum(state = 'removed') AS removed_memories FROM memories WHERE agent_id IS NOT NULL GROUP BY agent_id) AS counts ON counts.agent_id = agents.id"
)

CONTEXT_MEMORIES_SELECT = (
    "SELECT memory_deliveries.id AS delivery_id, memory_deliveries.session_agent_id, memory_deliveries.memory_id, memory_deliveries.cause,"
    " memory_deliveries.created_at AS delivered_at FROM memory_deliveries"
    " WHERE memory_deliveries.created_at > coalesce((SELECT max(hook_calls.created_at) FROM hook_calls"
    " WHERE hook_calls.session_agent_id = memory_deliveries.session_agent_id AND hook_calls.hook = 'compact'), '')"
    " AND memory_deliveries.created_at >= coalesce((SELECT coalesce(agent_sessions.started_at, agent_sessions.created_at) FROM agent_sessions"
    " WHERE agent_sessions.session_agent_id = memory_deliveries.session_agent_id ORDER BY agent_sessions.id DESC LIMIT 1), '')"
)

KEYWORD_MEMORIES_SELECT = (
    "SELECT memory_keywords.id AS keyword_id, memory_keywords.word, active_memories.*"
    " FROM memory_keywords JOIN active_memories ON active_memories.memory_id = memory_keywords.memory_id"
)
