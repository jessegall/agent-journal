class Module:
    pass


class SampleModule(Module):
    # @sin ModuleRegistrationDetector
    models = (First, Second)
    # @sin ModuleRegistrationDetector
    bindings = [(Interface, Implementation)]
    # @righteous ModuleRegistrationDetector
    listeners = [First, Second]
    # @righteous ModuleRegistrationDetector
    bindings = {Interface: Implementation}

    def method(self):
        # @righteous ModuleRegistrationDetector
        values = (First, Second)


class Container:
    # @righteous ModuleRegistrationDetector
    values = (First, Second)
