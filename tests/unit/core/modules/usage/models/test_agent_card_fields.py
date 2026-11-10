from dataclasses import fields

from core.modules.usage.models.agent_card import AgentCard
from core.modules.usage.models.support.agent_listing_state import AgentListingState
from core.modules.usage.models.support.views import AGENT_CARDS_SELECT

NEW_FIELDS = ("session_count", "replaced_session_end_reason", "memory_count", "retiring_actor_name")


def test_the_card_and_the_listed_agent_carry_the_fields_of_a_lasting_agent():
    for model in (AgentCard, AgentListingState):
        assert set(NEW_FIELDS) <= {field.name for field in fields(model)}


def test_the_view_selects_each_field_the_card_declares():
    for name in NEW_FIELDS:
        assert f" AS {name}," in AGENT_CARDS_SELECT
