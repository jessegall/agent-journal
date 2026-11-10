from engine.driver.driver import Driver
from engine.driver.suite import Suite


# @righteous architecture_drivers_driver_piece_without_a_name
class SampleSuite(Suite):
    name = "samples"


# @sin architecture_drivers_driver_piece_without_a_name
class SampleDriver(Driver):
    suite = "samples"
