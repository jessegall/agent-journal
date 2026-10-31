from core.modules.memories.memory import Memory


def memory_row(text):
    # @righteous architecture_memories_MemoryBuiltInHandlersDetector
    return Memory(creator_id=1, type="fact", text=text)
