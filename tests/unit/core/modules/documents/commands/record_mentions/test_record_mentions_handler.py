from core.modules.documents.commands.record_mentions.record_mentions_handler import RecordMentionsHandler
from engine.cli.row_numbers import RowNumbers
from engine.errors.refusal import Refusal

SHOP = 2


class ShopNumbers(RowNumbers):
    """In the shop environment agent 4 is row 44 and no agent has the number 9."""

    def row_id(self, model_name: str, number: int, environment_id: int | None) -> int:
        if (number, environment_id) != (4, SHOP):
            raise Refusal(f"no agent {number} in environment shop")
        return 44


def handler() -> RecordMentionsHandler:
    return RecordMentionsHandler(None, None, None, None, ShopNumbers())


def test_a_mention_of_agent_four_is_the_row_of_agent_four_in_the_environment_of_the_text():
    assert handler().row_reference("agent", 4, SHOP) == ("agent", 44)


def test_a_mention_of_a_number_no_agent_has_there_is_no_reference():
    assert handler().row_reference("agent", 9, SHOP) is None


def test_a_mention_of_another_model_keeps_its_number():
    assert handler().row_reference("task", 4, SHOP) == ("task", 4)
