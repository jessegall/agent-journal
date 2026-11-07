class Module:
    pass


class SampleModule(Module):
    # @sin module_registration
    models = (First, Second)
    # @sin module_registration
    bindings = [(Interface, Implementation)]
    # @righteous module_registration
    listeners = [First, Second]
    # @righteous module_registration
    bindings = {Interface: Implementation}

    def method(self):
        # @righteous module_registration
        values = (First, Second)


class Container:
    # @righteous module_registration
    values = (First, Second)
