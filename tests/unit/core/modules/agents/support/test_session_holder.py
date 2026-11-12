from datetime import datetime, timezone

from engine.time.timestamp import Timestamp
from core.modules.agents.commands.start_agent.start_agent_handler import StartAgentHandler
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_rows import AgentRows

ENDED = Timestamp(datetime(2026, 11, 1, tzinfo=timezone.utc))


def agent(row_id: int, role: str = "main", number: int = 1, ended: bool = False) -> Agent:
    return Agent(id=row_id, creator_id=1, session="s-old", program="claude", role=role, number=number, ended_at=ENDED if ended else None)


def test_the_running_row_holds_a_session_two_rows_share():
    assert AgentRows.session_holder([agent(30, number=33, ended=True), agent(78)]) == agent(78)


def test_with_no_running_row_the_newest_holds_the_session():
    assert AgentRows.session_holder([agent(78, ended=True), agent(30, number=33, ended=True)]) == agent(78, ended=True)


def test_no_row_holds_no_session():
    assert AgentRows.session_holder([]) is None


def test_an_older_main_row_resumed_goes_to_the_numbered_main_row():
    assert StartAgentHandler.is_older_main_row(agent(30, number=33, ended=True), agent(78))
    assert not StartAgentHandler.is_older_main_row(agent(78, ended=True), agent(78))
    assert not StartAgentHandler.is_older_main_row(agent(40, role="helper", number=40, ended=True), agent(78))
    assert not StartAgentHandler.is_older_main_row(agent(30, number=33, ended=True), None)
