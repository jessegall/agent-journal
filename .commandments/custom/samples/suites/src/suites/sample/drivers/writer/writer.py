from engine.driver.driver import Driver
# @sin architecture_layout_driver_imports_a_shared_part
from suites.sample.rules.shared_rule import SharedRule
# @righteous architecture_layout_driver_imports_a_shared_part
from suites.sample.drivers.writer.rules.writer_rule import WriterRule


# @righteous architecture_layout_suite_driver_outside_its_folder
class WriterDriver(Driver):
    name = "sample.writer"
    rules = [WriterRule, SharedRule]
