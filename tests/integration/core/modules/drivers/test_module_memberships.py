import pytest

from engine.file.file_access import FileAccess
from engine.module.errors.module_error import ModuleError
from engine.module.module_removal import ModuleRemoval
from engine.registry.registry import Registry
from tests.stories.core.modules.drivers.support.module_memberships import PATH


def test_membership_in_an_unknown_suite_is_refused(journal):
    journal.expect_sync_refusal(f"{PATH}:UnknownSuiteModuleJoining",
                             "module acme.unknown is part of suite absent: install the module that ships it first")


def test_a_member_must_depend_on_the_module_that_ships_its_suite(journal):
    journal.expect_sync_refusal(f"{PATH}:MissingDependencyModuleJoining",
                                "module acme.independent is part of suite coding of module journal.suites.coding, which it does not depend on")


def test_the_registry_keeps_joined_and_shipped_suites(journal_with):
    journal = journal_with(f"{PATH}:SuiteModuleJoining", f"{PATH}:AcmeSuiteOfSuiteModule")
    journal.expect_sync_success(f"{PATH}:MemberModuleJoining")
    suites = Registry.read(journal.database).module_suites
    assert suites["acme.suite"] == ("coding", "acme") and suites["acme.member"] == tuple(["acme"])
    assert suites["journal.suites.coding"] == tuple(["coding"]) and suites["journal.suites.coding.workers"] == tuple(["coding"])
    assert suites["journal.suites.coding.checks"] == tuple(["coding"]) and suites["journal.core.templates"] == ()


def test_a_suite_module_cannot_be_removed_while_another_module_names_it_as_parent(journal_with):
    journal = journal_with(f"{PATH}:SuiteModuleJoining", f"{PATH}:AcmeSuiteOfSuiteModule", f"{PATH}:MemberModuleJoining")
    listed = FileAccess.read(journal.home.module_list)
    stored_rows = tuple(journal.database.connection.iterdump())
    with pytest.raises(ModuleError, match="module acme.member depends on acme.suite"):
        journal.container.get(ModuleRemoval).remove("acme.suite")
    assert tuple(journal.database.connection.iterdump()) == stored_rows and FileAccess.read(journal.home.module_list) == listed
