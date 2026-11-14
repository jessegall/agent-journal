from engine.helper_type.command_allow_list import CommandAllowList
from dataclasses import MISSING, fields, replace

from engine.helper_type.helper_behaviours import HelperBehaviours
from engine.helper_type.helper_type import HelperType
from engine.helper_type.helper_type_book import HelperTypeBook
from engine.helper_type.helper_type_entry import HelperTypeEntry
from engine.module.helper_type_check import HelperTypeCheck
from engine.module.module import Module
from engine.module.suite import Suite
from engine.module.suite_list import SuiteList

RETIRED_BEHAVIOURS = HelperBehaviours.retired()


class Scribe(HelperType):
    key = "scribe"
    label = "Scribe"
    behaviours = replace(RETIRED_BEHAVIOURS, takes_tasks=True)
    commands = CommandAllowList()


class CopyScribe(Scribe):
    label = "Copy scribe"


class UnlabelledScribe(HelperType):
    key = "scribe"
    behaviours = RETIRED_BEHAVIOURS
    commands = CommandAllowList()


class SilentScribe(HelperType):
    key = "scribe"
    label = "Scribe"
    commands = CommandAllowList()


class ScribeModule(Module):
    name = "sample.scribe"
    dependencies = ["journal.core.agents"]


class CopyModule(Module):
    name = "sample.copy"
    dependencies = ["journal.core.agents"]


class ScribeSuite(Suite):
    name = "scribe"
    modules = [ScribeModule]
    helper_types = [Scribe]


class CopySuite(Suite):
    name = "copy"
    modules = [CopyModule]
    helper_types = [CopyScribe]


def problems(*suites: type[Suite]) -> tuple[str, ...]:
    listed = SuiteList(suites)
    return HelperTypeCheck().problems(listed.modules(), (), listed)


def declaration_problems(declaration: type[HelperType]) -> tuple[str, ...]:
    suite = type("OneSuite", tuple([Suite]), {"name": "one", "modules": [ScribeModule], "helper_types": [declaration]})
    return problems(suite)


def test_a_type_is_asked_its_behaviours_and_keeps_the_fields_it_declares():
    entry = HelperTypeEntry.declared("sample.scribe", Scribe)
    book = HelperTypeBook(tuple([entry]))
    assert book.behaviours("scribe").takes_tasks is True
    assert book.behaviours("scribe").dispatches is False
    assert (entry.key, entry.label, entry.behaviours) == ("scribe", "Scribe", Scribe.behaviours)


def test_every_behaviour_is_a_field_with_no_default():
    assert all(field.default is MISSING and field.default_factory is MISSING for field in fields(HelperBehaviours))


def test_a_type_without_a_label_stops_the_boot_naming_the_type_and_the_field():
    assert declaration_problems(UnlabelledScribe) == tuple(["sample.scribe's helper type scribe has no label"])


def test_a_type_without_behaviours_stops_the_boot_naming_the_type_and_the_field():
    assert declaration_problems(SilentScribe) == tuple(["sample.scribe's helper type scribe has no behaviours"])


def test_two_suites_that_register_one_key_stop_the_boot_naming_both_suites():
    assert problems(ScribeSuite, CopySuite) == tuple(["suite copy and suite scribe both register helper type scribe"])


def test_a_stored_key_no_module_registers_answers_no_to_every_behaviour():
    book = HelperTypeBook(tuple([HelperTypeEntry.declared("sample.scribe", Scribe)]))
    assert book.behaviours("clerk") == RETIRED_BEHAVIOURS
    assert not any(getattr(book.behaviours("clerk"), field.name) for field in fields(HelperBehaviours))


def test_a_stored_key_no_module_registers_has_no_folder_of_its_own():
    book = HelperTypeBook(tuple([HelperTypeEntry.declared("sample.scribe", Scribe)]))
    assert not book.has_separate_folder("clerk") and not book.has_separate_folder("scribe")
