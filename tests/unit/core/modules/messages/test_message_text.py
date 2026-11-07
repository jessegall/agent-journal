from core.base.cli.row_links import RowLinks
from core.base.metadata import Metadata
from core.modules.messages.support.messages_module_name import MESSAGES_MODULE
from core.modules.messages.models.enums.message_type import MessageType
from core.modules.messages.models.message import Message
from core.modules.messages.support.message_text import MessageText


class KeptLinks(RowLinks):
    """Names the rows it was given, leaving out the exceptions as the stored links do."""

    def __init__(self, *names: str) -> None:
        self.names = names

    def lines(self, model_name: str, row_id: int, exceptions: tuple[str, ...] = ()) -> list[str]:
        shown_names = [name for name in self.names if name not in exceptions]
        return [f"links: {', '.join(shown_names)}"] if shown_names else []


def message(**fields: object) -> Message:
    return Message(id=7, environment_id=1, creator_id=1, type=MessageType.USER, text="Fix the cart", **fields)


def comment_metadata(model: str, row_id: int) -> Metadata:
    return Metadata({MESSAGES_MODULE: {"commented_row": {"model": model, "id": row_id}}})


def test_a_plain_message_is_only_its_words():
    assert list(MessageText.built(message(), KeptLinks()).lines()) == ["Fix the cart"]


def test_a_reply_names_its_parent():
    assert MessageText.built(message(parent_id=3), KeptLinks()).lines() == ("Fix the cart", "reply on: message:3")


def test_a_comment_names_its_text_for_each_kind_of_text():
    for model in ("document", "report", "plan"):
        assert MessageText.built(message(metadata=comment_metadata(model, 9)), KeptLinks()).lines() == ("Fix the cart", f"comment on: {model}:9")


def test_links_come_last_and_all_on_one_line():
    assert MessageText.built(message(), KeptLinks("task:123", "plan:321")).lines() == ("Fix the cart", "links: task:123, plan:321")


def test_the_commented_text_is_not_named_again_under_links():
    text = MessageText.built(message(metadata=comment_metadata("plan", 9)), KeptLinks("plan:9", "task:1"))
    assert text.lines() == ("Fix the cart", "comment on: plan:9", "links: task:1")


def test_a_comment_with_no_other_link_has_no_links_line():
    assert MessageText.built(message(metadata=comment_metadata("plan", 9)), KeptLinks("plan:9")).lines() == ("Fix the cart", "comment on: plan:9")


def test_the_order_is_reply_comment_links():
    text = MessageText.built(message(parent_id=3, metadata=comment_metadata("report", 9)), KeptLinks("task:1"))
    assert text.lines() == ("Fix the cart", "reply on: message:3", "comment on: report:9", "links: task:1")


def test_the_json_keeps_the_same_parts():
    text = MessageText.built(message(parent_id=3), KeptLinks("task:1"))
    assert text.json() == {"id": 7, "text": "Fix the cart", "origins": ["reply on: message:3"], "links": ["links: task:1"]}
