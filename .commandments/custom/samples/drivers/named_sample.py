from core.base.driver.driver import Driver
from core.base.driver.suite import Suite


# @righteous architecture_drivers_PieceDeclaresNameDetector
class SampleSuite(Suite):
    name = "samples"


# @sin architecture_drivers_PieceDeclaresNameDetector
class SampleDriver(Driver):
    suite = "samples"
