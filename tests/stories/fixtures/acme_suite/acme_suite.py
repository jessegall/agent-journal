from engine.module.suite import Suite
from engine.viewer.entrance import Entrance


class AcmeEntrance(Entrance):
    key = "acme"
    windows = ["findings.findings"]


class AcmeSuite(Suite):
    name = "acme"
    requires = ["coding"]
    entrances = [AcmeEntrance]
