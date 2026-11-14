from core.modules.memories.models.memory import Memory


def memory_row(text):
    # @righteous architecture_memories_memory_built_outside_handlers
    return Memory(creator_id=1, type="fact", text=text)
