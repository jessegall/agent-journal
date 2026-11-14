from core.modules.processes.support.reader_selection import ReaderSelection
from core.modules.processes.support.stock_reader import STOCK_READERS
from core.modules.processes.support.streaming_hints import STREAMING_HINTS
from tests.stories.core.modules.processes.support.stock_samples import HINT_EXAMPLES, STOCK_SAMPLES, TOOLS_WITHOUT_STOCK_READER, expect_none_listed

HINT_PATTERNS = tuple(pattern for patterns, _ in STREAMING_HINTS for pattern in patterns.split(","))


def test_every_stock_reader_has_a_recorded_sample():
    names = {sample.name for sample in STOCK_SAMPLES}
    expect_none_listed([reader.name for reader in STOCK_READERS if reader.name not in names], "stock readers without a recorded sample")


def test_every_sample_says_where_its_output_came_from_and_has_a_stock_reader():
    readers = {reader.name for reader in STOCK_READERS}
    expect_none_listed([sample.name for sample in STOCK_SAMPLES if not (sample.source.strip() and sample.output.strip() and sample.name in readers)], "samples without a source, an output or a stock reader")


def test_every_tool_with_a_streaming_hint_has_a_stock_reader_or_says_why_not():
    wrong = [pattern for pattern in HINT_PATTERNS
             if any(ReaderSelection.matches(reader.commands, HINT_EXAMPLES[pattern]) for reader in STOCK_READERS) == (pattern in TOOLS_WITHOUT_STOCK_READER)]
    expect_none_listed(wrong, "streaming hints whose stock reader and listed exception disagree")
