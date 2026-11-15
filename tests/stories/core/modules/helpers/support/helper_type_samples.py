from engine.helper_type.command_allow_list import CommandAllowList
from core.modules.helpers.types.helper import Helper
from engine.agent_machine.driver import Driver
from core.modules.drivers.drivers.helper.helper_agent_driver import HelperAgentDriver
from engine.enums.work_stop import WorkStop
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
    suite = SCRIBE_SUITE
    agent_type = Scribe.key
    gathers = [HelperAgentDriver]
    rank_order = HelperAgentDriver.rank_order
    work_stop = WorkStop.HANDOVER


class ScribeModule(Module):
    name = "sample.scribe"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.agents"]
    agent_drivers = [ScribeDriver]


class ScribeSuite(Suite):
    """A made-up suite that registers one helper type of its own, with no change to the core."""

    name = SCRIBE_SUITE
    modules = [ScribeModule]
    helper_types = [Scribe]


class UnlabelledScribe(HelperType):
    key = "scribe"
    commands = CommandAllowList()


class UnlabelledScribeModule(Module):
    name = "sample.unlabelled-scribe"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.agents"]


class UnlabelledScribeSuite(Suite):
    """A made-up suite whose helper type has no label."""

    name = "unlabelled-scribe"
    modules = [UnlabelledScribeModule]
    helper_types = [UnlabelledScribe]


class CopyScribe(Helper):
    key = "scribe"
    label = "Copy scribe"


class CopyScribeModule(Module):
    name = "sample.copy-scribe"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.agents"]


class CopyScribeSuite(Suite):
    """A made-up suite that registers the helper type the scribe suite registers."""

    name = "copy-scribe"
    modules = [CopyScribeModule]
    helper_types = [CopyScribe]


class RetiringModule(Module):
    """A module whose helper type is retired when the project stops loading it."""

    name = "sample.retiring"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.agents"]
    helper_types = [Scribe]
