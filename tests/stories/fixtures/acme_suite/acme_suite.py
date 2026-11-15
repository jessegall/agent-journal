from engine.module.suite import Suite
from engine.viewer.entry_point import EntryPoint


class AcmeEntryPoint(EntryPoint):
    key = "acme"
    windows = ["findings.findings"]


class AcmeSuite(Suite):
    name = "acme"
    requires = ["coding"]
    entry_points = [AcmeEntryPoint]
