from types import SimpleNamespace

import pytest

from core.modules.drivers.support.agent_line_check import AgentLineCheck
from core.modules.drivers.support.type_command_check import TypeCommandCheck
from core.modules.helpers.types.helper import Helper
from engine.actor.actor import Actor
from engine.caller.caller import Caller
from engine.enums.actor_type import ActorType
from engine.errors.refusal import Refusal
from engine.helper_type.enums.journal_line_class import JournalLineClass
from engine.helper_type.helper_type_book import MAIN_KEY, HelperTypeBook
from engine.helper_type.helper_type_entry import HelperTypeEntry
from engine.helper_type.journal_line import JournalLine
from engine.row.row_owner import MAIN_AGENT, RowOwner

TYPES = HelperTypeBook(tuple([HelperTypeEntry.declared("journal.core.helpers", Helper)]))
TASK_EDIT = JournalLine("task edit", frozenset([JournalLineClass.CHANGES]))
SETTING_SET = JournalLine("setting set", frozenset([JournalLineClass.CHANGES, JournalLineClass.EXTERNAL]))
TASK_READ = JournalLine("task show", frozenset([JournalLineClass.READS]))
PROFILE_FILES = SimpleNamespace(registered=lambda name: None)


def line_check(role: str) -> AgentLineCheck:
    owner = RowOwner(MAIN_AGENT if role == MAIN_KEY else 7, 1)
    return AgentLineCheck(SimpleNamespace(find_unscoped=lambda agent_id: SimpleNamespace(id=agent_id, role=role, profile="")), TypeCommandCheck(TYPES, PROFILE_FILES),
                          SimpleNamespace(row_owner=lambda actor_id: owner))


def agent_caller() -> Caller:
    return Caller(Actor(7, ActorType.AGENT))


def test_a_helper_is_refused_at_the_server_a_line_its_type_does_not_list():
    with pytest.raises(Refusal) as refused:
        line_check(Helper.key).check(agent_caller(), SETTING_SET)
    assert refused.value.reason.startswith("A read-only helper may not run setting set: it runs the groups memory, review-point")


def test_a_helper_runs_a_line_its_type_lists():
    line_check(Helper.key).check(agent_caller(), TASK_READ)


def test_the_main_agent_and_a_person_are_never_refused():
    line_check(MAIN_KEY).check(agent_caller(), SETTING_SET)
    line_check(Helper.key).check(Caller(Actor(3, ActorType.USER)), SETTING_SET)


def test_help_lists_for_a_helper_only_the_lines_its_type_lists():
    assert line_check(Helper.key).allows(agent_caller(), TASK_READ) and not line_check(Helper.key).allows(agent_caller(), SETTING_SET)
    assert line_check(MAIN_KEY).allows(agent_caller(), TASK_EDIT)
