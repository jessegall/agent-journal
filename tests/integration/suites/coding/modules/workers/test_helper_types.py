from core.modules.agents.models.agent import Agent
from tests.stories.core.support.agent_labels import agent_number
from datetime import timedelta
import json

import pytest

from engine.enums.access import Access
from engine.enums.agent_role import AgentRole
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.database.database import Database
from engine.registry.registry import Registry
from core.modules.drivers.models.agent_line import AgentLine
from tests.stories.core.support.coding_fixtures import CodingEnvironment
from engine.enums.tool_type import ToolType
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.suites.coding.modules.workers.support.helper_types import ClerkStarted, HelperStarted, BuilderNativeHelper, EveryHelperRule, ReaderHelpersRule, WorkerStarted
from suites.coding.support.shipped_profiles import WORKER_MEDIOR_PROFILE


READ_SAMPLE = HookSamples.tool_use("Read", ToolType.READ, ["README.md"], None)
FIXTURES = {"helper": HelperStarted, "helper": BuilderNativeHelper, "worker": WorkerStarted, "clerk": ClerkStarted}


def test_shipped_types_restore_their_access_inheritance_and_worker_roster(played):
    story = played(CodingEnvironment)
    book = story.container.get(HelperTypeBook)
    worker = book.find("worker")
    story.expect_rows(AgentRole.HELPER.value == "helper", book.find("main").access is Access.WRITING,
                      book.find("helper").access is Access.READ, book.find("helper").label == "Read-only helper",
                      {"helper", "worker", "merger"} <= set(book.helper_keys()), book.is_helper("worker"), not book.is_helper("main"),
                      book.find("merger").label == "Merger", book.find("merger").module == "journal.suites.coding.workers",
                      worker.access is Access.WRITING, worker.separate_folder,
                      worker.default_profile == f"{WORKER_MEDIOR_PROFILE.name}", worker.start_line == "journal worker dispatch",
                      worker.roster is not None)
    story.expect_rows(story.container.get(worker.roster.loaded()).available(1) == ())
    registry = Registry.read(story.container.get(Database))
    story.expect_rows(all(driver.role in registry.role_names for driver in registry.drivers),
                      all(role in registry.role_names for rule in registry.rules for role in rule.roles))


















