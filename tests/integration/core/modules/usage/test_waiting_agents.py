import json

from engine.command.bus import Bus
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from tests.integration.core.modules.viewer.test_window_search import DatabaseQuestions

WORKING = "agent cards --show running --include-main --json"


def working_ids(journal) -> list[int]:
    return [row["id"] for row in json.loads(journal.run(WORKING).output_text)["rows"]]


def test_an_agent_whose_process_ended_while_it_waits_on_an_answer_stays_working(played):
    journal = played(DatabaseQuestions)
    journal.container.get(Bus).run(EndAgent(journal.agent.id), journal.agent)
    assert journal.agent.id in working_ids(journal), working_ids(journal)


def test_an_ended_agent_with_its_questions_answered_leaves_working(played):
    journal = played(DatabaseQuestions)
    for question in json.loads(journal.run("question list --json").output_text)["rows"]:
        journal.run(f'question answer {question["id"]} --answer Postgres', actor=journal.user)
    journal.container.get(Bus).run(EndAgent(journal.agent.id), journal.agent)
    assert journal.agent.id not in working_ids(journal), working_ids(journal)
