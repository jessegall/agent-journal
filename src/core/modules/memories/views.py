ACTIVE_MEMORIES_SELECT = (
    "SELECT memories.id AS memory_id, memories.environment_id, memories.agent_id, memories.type, memories.text,"
    " memories.weight, memories.due_at, memory_types.fades, memory_types.start_delivery, memory_types.mark_delivery,"
    " memory_types.keyword_delivery, CASE memories.type WHEN 'rule' THEN 0 WHEN 'reminder' THEN 1 WHEN 'fact' THEN 2 ELSE 3 END AS delivery_order"
    " FROM memories JOIN memory_types ON memory_types.name = memories.type"
    " WHERE memories.state = 'active' AND memories.weight > 0"
)

CONTEXT_MEMORIES_SELECT = (
    "SELECT memory_deliveries.id AS delivery_id, memory_deliveries.agent_id, memory_deliveries.memory_id, memory_deliveries.cause,"
    " memory_deliveries.created_at AS delivered_at FROM memory_deliveries"
    " WHERE memory_deliveries.created_at > coalesce((SELECT max(hook_calls.created_at) FROM hook_calls"
    " WHERE hook_calls.agent_id = memory_deliveries.agent_id AND hook_calls.hook = 'compact'), '')"
)

KEYWORD_MEMORIES_SELECT = (
    "SELECT memory_keywords.id AS keyword_id, memory_keywords.word, active_memories.*"
    " FROM memory_keywords JOIN active_memories ON active_memories.memory_id = memory_keywords.memory_id"
    " WHERE active_memories.keyword_delivery = 1"
)
