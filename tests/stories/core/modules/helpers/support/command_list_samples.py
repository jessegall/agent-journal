from engine.command.command import Command
from engine.enums.access import Access
from engine.helper_type.command_allow_list import CommandAllowList
from engine.helper_type.helper_behaviours import HelperBehaviours
from engine.helper_type.helper_type import HelperType
from engine.module.module import Module
from engine.module.suite import Suite
from engine.profile.agent_profile import AgentProfile
from engine.subcommand.read_subcommand import ReadSubcommand
from engine.subcommand.subcommand import Subcommand


class ShelfShow(ReadSubcommand[object]):
    cli_name = "shelf"
    name = "show"


class ShelfStock(Subcommand[Command[object], object]):
    cli_name = "shelf"
    name = "stock"


class ShelvesModule(Module):
    """A module that adds a read line and a change line no helper type lists."""

    name = "sample.shelves"
    dependencies = ["journal.core.agents"]
    subcommands = [ShelfShow, ShelfStock]


class WideProfileModule(Module):
    """A module whose helper profile names a line its type does not list."""

    name = "sample.wide-profile"
    dependencies = ["journal.core.agents"]
    profiles = [AgentProfile("sample-wide", "Widens its type", agent_type="helper", commands=CommandAllowList(lines=tuple(["setting set"])))]


class TypoClerk(HelperType):
    key = "clerk"
    label = "Clerk"
    access = Access.READ
    behaviours = HelperBehaviours.retired()
    commands = CommandAllowList(lines=tuple(["task shwo"]))


class ListlessClerk(HelperType):
    key = "clerk"
    label = "Clerk"
    access = Access.READ
    behaviours = HelperBehaviours.retired()


class ClerkModule(Module):
    name = "sample.clerk"
    dependencies = ["journal.core.agents"]


class TypoClerkSuite(Suite):
    name = "typo-clerk"
    modules = [ClerkModule]
    helper_types = [TypoClerk]


class ListlessClerkSuite(Suite):
    name = "listless-clerk"
    modules = [ClerkModule]
    helper_types = [ListlessClerk]


class ShowingClerk(HelperType):
    key = "clerk"
    label = "Clerk"
    access = Access.READ
    behaviours = HelperBehaviours.retired()
    commands = CommandAllowList(lines=tuple(["task show"]))


class ListingClerk(ShowingClerk):
    commands = CommandAllowList(lines=tuple(["task list"]))


class ShowingClerkSuite(Suite):
    name = "showing-clerk"
    modules = [ClerkModule]
    helper_types = [ShowingClerk]


class ListingClerkSuite(Suite):
    name = "listing-clerk"
    modules = [ClerkModule]
    helper_types = [ListingClerk]
