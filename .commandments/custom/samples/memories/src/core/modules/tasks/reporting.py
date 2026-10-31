from core.modules.memories.models.memory import Memory
from core.modules.memories.rules.support.memory_lines import MemoryLines


def listing_lines(rows):
    # @sin architecture_memories_LinesOnlyFromRulesDetector
    return MemoryLines.listing(rows)


def memory_row(text):
    # @sin architecture_memories_MemoryBuiltInHandlersDetector
    return Memory(creator_id=1, type="fact", text=text)
