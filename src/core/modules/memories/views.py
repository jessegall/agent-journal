STANDING_MEMORIES_SELECT = (
    "SELECT memories.id AS memory_id, memories.environment_id, memories.agent_id, memories.type, memories.text,"
    " memories.weight, memories.due_at, memory_types.fades, memory_types.given_at_start, memory_types.given_at_mark,"
    " memory_types.given_by_keyword, CASE memories.type WHEN 'rule' THEN 0 WHEN 'reminder' THEN 1 ELSE 2 END AS giving_order"
    " FROM memories JOIN memory_types ON memory_types.name = memories.type"
    " WHERE memories.state = 'active' AND memories.weight > 0"
)

MEMORIES_IN_CONTEXT_SELECT = (
    "SELECT memory_givings.id AS giving_id, memory_givings.agent_id, memory_givings.memory_id, memory_givings.cause,"
    " memory_givings.created_at AS given_at FROM memory_givings"
    " WHERE memory_givings.created_at > coalesce((SELECT max(hook_calls.created_at) FROM hook_calls"
    " WHERE hook_calls.agent_id = memory_givings.agent_id AND hook_calls.hook = 'compact'), '')"
)

MEMORY_WORDS_SELECT = (
    "SELECT memory_keywords.id AS keyword_id, memory_keywords.word, standing_memories.*"
    " FROM memory_keywords JOIN standing_memories ON standing_memories.memory_id = memory_keywords.memory_id"
    " WHERE standing_memories.given_by_keyword = 1"
)
