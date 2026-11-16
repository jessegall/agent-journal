from argparse import Namespace
from types import SimpleNamespace

import pytest

from core.modules.messages.commands.send_agent_message.send_agent_message import SendAgentMessage
from core.modules.messages.commands.send_message.send_message_subcommand import SendMessageSubcommand
from engine.cli.agent_ids import AgentIds
from engine.errors.refusal import Refusal

SHOP = SimpleNamespace(environment_id=2)


class ShopAgents(AgentIds):
    """The shop environment has agent 2."""

    def checked(self, agent_id: int, environment_id: int | None) -> int:
        assert (agent_id, environment_id) == (2, SHOP.environment_id)
        return agent_id


def line(target: str) -> Namespace:
    return Namespace(text="Count the till", files=[], target_agent=None, to=target)


def test_a_message_to_agent_two_goes_to_agent_two_once_the_environment_of_the_line_has_it():
    command = SendMessageSubcommand(ShopAgents()).command(line("agent:2"), SHOP)
    assert isinstance(command, SendAgentMessage) and command == SendAgentMessage(2, "Count the till")


@pytest.mark.parametrize("target", ["agent:0", "agent:x", "agent:", "worker:2", "agent:1e3"])
def test_a_target_that_is_no_agent_id_is_refused(target):
    with pytest.raises(Refusal, match="is not an agent"):
        SendMessageSubcommand(ShopAgents()).command(line(target), SHOP)
