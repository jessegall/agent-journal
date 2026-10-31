from core.base.refusal import Refusal


def refuse_both(count: int) -> None:
    if count:
        # @sin naming_PlainJournalTextDetector
        raise Refusal("the note names a row that holds nothing", "ask again")
    # @righteous naming_PlainJournalTextDetector
    raise Refusal("the note has no row", "ask again")


# @sin architecture_core_SqlLayerDetector
SELECT_ALL = "SELECT * FROM notes WHERE id = 1"
# @righteous architecture_core_SqlLayerDetector
GREETING = "Select a note"
