import pytest

from engine.database.database import Database
from core.base.module.module_error import ModuleError
from core.base.module.module_removal import ModuleRemoval
from engine.registry.registry import Registry
from tests.stories.core.modules.drivers.support.module_memberships import PATH
from tests.stories.core.support.fixtures import MainEnvironment


def test_membership_in_an_unknown_suite_is_refused(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(f"{PATH}:UnknownSuiteModule",
                             "module acme.unknown is part of suite absent: install the module that ships it first")


def test_a_member_must_depend_on_the_module_that_ships_its_suite(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_refusal(f"{PATH}:MissingDependencyModule",
                             "module acme.independent is part of suite coding of module journal.suites.coding, "
                             "which it does not depend on")


def test_the_registry_keeps_joined_and_shipped_suites(new_story):
    story = new_story(f"{PATH}:SuiteModule", fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:MemberModule")
    registry = Registry.read(story.container.get(Database))
    story.expect_rows(registry.module_suites["acme.suite"] == ("coding", "acme"),
                      registry.module_suites["acme.member"] == tuple(["acme"]),
                      registry.module_suites["journal.suites.coding"] == tuple(["coding"]),
                      registry.module_suites["journal.suites.coding.workers"] == tuple(["coding"]),
                      registry.module_suites["journal.suites.coding.checks"] == tuple(["coding"]),
                      registry.module_suites["journal.core.templates"] == ())


def test_a_suite_module_cannot_be_removed_while_another_module_names_it_as_parent(new_story):
    story = new_story(f"{PATH}:SuiteModule", f"{PATH}:MemberModule", fixture=MainEnvironment)
    database = story.container.get(Database)
    listed = story.home.module_list.read_text()
    stored_rows = tuple(database.connection.iterdump())
    with pytest.raises(ModuleError, match="module acme.member depends on acme.suite"):
        story.container.get(ModuleRemoval).remove("acme.suite")
    story.expect_rows(tuple(database.connection.iterdump()) == stored_rows, story.home.module_list.read_text() == listed)
