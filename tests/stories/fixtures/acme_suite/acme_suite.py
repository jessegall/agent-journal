from engine.driver.suite import Suite


class AcmeSuite(Suite):
    name = "acme"
    requires = ["coding"]
    windows = ["findings.findings"]
