from tests.stories.core.modules.drivers.support.module_memberships import PATH


def test_membership_in_an_unknown_suite_is_refused(journal):
    journal.expect_sync_refusal(f"{PATH}:UnknownSuiteModuleJoining",
                             "module acme.unknown is part of suite absent: install the module that ships it first")
