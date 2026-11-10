from engine.driver.suite import Suite
from engine.helper_type.helper_type import HelperType
from engine.module.module import Module


class ShopModule(Module):
    name = "folder.shop"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents"]


class CartsModule(Module):
    name = "folder.carts"
    requires_core = ">=5,<6"
    dependencies = ["folder.shop"]


class DepotModule(Module):
    name = "folder.depot"
    requires_core = ">=5,<6"
    dependencies = ["journal.core.agents"]


class ShopSuite(Suite):
    """A sample suite that lists its own module and one more."""

    name = "shop"
    modules = [ShopModule, CartsModule]
    helper_types = [HelperType("scout", "Scout")]


class DepotSuite(Suite):
    """A sample suite that lists a module the shop suite lists too."""

    name = "depot"
    modules = [DepotModule, CartsModule]


class DepotScoutSuite(Suite):
    """A sample suite that registers the helper type the shop suite registers."""

    name = "depot"
    modules = [DepotModule]
    helper_types = [HelperType("scout", "Depot scout")]
