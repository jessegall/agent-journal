from core.base.driver.driver import Driver
from core.base.driver.suite import Suite


# @righteous architecture_drivers_driver_piece_without_a_name
class SampleSuite(Suite):
    name = "samples"


# @sin architecture_drivers_driver_piece_without_a_name
class SampleDriver(Driver):
    suite = "samples"
