from core.modules.documents.commands.record_mentions.record_mentions_handler import RecordMentionsHandler
from engine.cli.agent_ids import AgentIds
from engine.errors.refusal import Refusal

SHOP = 2


class ShopAgents(AgentIds):
    """In the shop environment agent 4 exists and no agent has the id 9."""

    def checked(self, agent_id: int, environment_id: int | None) -> int:
        if (agent_id, environment_id) != (4, SHOP):
            raise Refusal(f"no agent {agent_id} in this environment")
        return agent_id


def handler() -> RecordMentionsHandler:
    return RecordMentionsHandler(None, None, None, None, ShopAgents())


def test_a_mention_of_agent_four_is_agent_four_when_the_environment_of_the_text_has_it():
    assert handler().row_reference("agent", 4, SHOP) == ("agent", 4)


def test_a_mention_of_an_id_no_agent_there_has_is_no_reference():
    assert handler().row_reference("agent", 9, SHOP) is None


def test_a_mention_of_another_model_keeps_its_number():
    assert handler().row_reference("task", 4, SHOP) == ("task", 4)
