from engine.module.module import Module


class CartsSampleModule(Module):
    name = "shop.carts"
    # @sin architecture_suites_module_names_its_suite
    parent_suite = "shop"
    # @righteous architecture_suites_module_names_its_suite
    dependencies = ["shop.suite"]
