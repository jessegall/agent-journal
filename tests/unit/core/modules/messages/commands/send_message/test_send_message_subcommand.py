from argparse import Namespace
from types import SimpleNamespace

import pytest

from core.modules.messages.commands.send_agent_message.send_agent_message import SendAgentMessage
from core.modules.messages.commands.send_message.send_message_subcommand import SendMessageSubcommand
from engine.cli.row_numbers import RowNumbers
from engine.errors.refusal import Refusal

SHOP = SimpleNamespace(environment_id=2)


class ShopNumbers(RowNumbers):
    """In the shop environment agent 2 is row 40."""

    def row_id(self, model_name: str, number: int, environment_id: int | None) -> int:
        assert (model_name, environment_id) == ("agent", SHOP.environment_id)
        return {2: 40}[number]


def line(to: str) -> Namespace:
    return Namespace(text="Count the till", files=[], target_agent=None, to=to)


def test_a_message_to_agent_two_goes_to_the_row_of_agent_two_in_the_environment_of_the_line():
    command = SendMessageSubcommand(ShopNumbers()).command(line("agent:2"), SHOP)
    assert isinstance(command, SendAgentMessage) and command == SendAgentMessage(40, "Count the till")


@pytest.mark.parametrize("to", ["agent:0", "agent:x", "agent:", "worker:2", "agent:1e3"])
def test_a_target_that_is_no_agent_number_is_refused(to):
    with pytest.raises(Refusal, match="is not an agent"):
        SendMessageSubcommand(ShopNumbers()).command(line(to), SHOP)
