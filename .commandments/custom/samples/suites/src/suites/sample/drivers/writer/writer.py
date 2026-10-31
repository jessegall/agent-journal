from core.base.driver.driver import Driver
# @sin architecture_layout_DriversImportOnlyTheirOwnPartsDetector
from suites.sample.rules.shared_rule import SharedRule
# @righteous architecture_layout_DriversImportOnlyTheirOwnPartsDetector
from suites.sample.drivers.writer.rules.writer_rule import WriterRule


# @righteous architecture_layout_DriversInDriverFoldersDetector
class WriterDriver(Driver):
    name = "sample.writer"
    rules = [WriterRule, SharedRule]
