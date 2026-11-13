from core.modules.helpers.types.helper import Helper
from engine.driver.driver import Driver
from engine.helper_type.helper_type import HelperType
from engine.module.module import Module
from engine.module.suite import Suite

SCRIBE_SUITE = "scribe"


class Scribe(Helper):
    """A made-up helper type a made-up suite adds as one class."""

    key = "scribe"
    label = "Scribe"


class ScribeDriver(Driver):
    name = "scribe.scribe"
    suite_name = SCRIBE_SUITE
    role = Scribe.key


class ScribeModule(Module):
    name = "sample.scribe"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents"]
    drivers = [ScribeDriver]


class ScribeSuite(Suite):
    """A made-up suite that registers one helper type of its own, with no change to the core."""

    name = SCRIBE_SUITE
    modules = [ScribeModule]
    helper_types = [Scribe]


class NamelessScribe(HelperType):
    key = "scribe"


class NamelessScribeModule(Module):
    name = "sample.nameless-scribe"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents"]


class NamelessScribeSuite(Suite):
    """A made-up suite whose helper type has no label."""

    name = "nameless-scribe"
    modules = [NamelessScribeModule]
    helper_types = [NamelessScribe]


class CopyScribe(Helper):
    key = "scribe"
    label = "Copy scribe"


class CopyScribeModule(Module):
    name = "sample.copy-scribe"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents"]


class CopyScribeSuite(Suite):
    """A made-up suite that registers the helper type the scribe suite registers."""

    name = "copy-scribe"
    modules = [CopyScribeModule]
    helper_types = [CopyScribe]


class RetiringModule(Module):
    """A module whose helper type is retired when the project stops loading it."""

    name = "sample.retiring"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents"]
    helper_types = [Scribe]
