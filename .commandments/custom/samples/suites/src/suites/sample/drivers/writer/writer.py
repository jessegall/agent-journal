from core.base.driver.driver import Driver
# @sin architecture_suites_DriversImportOnlyTheirOwnPartsDetector
from suites.sample.rules.shared_rule import SharedRule
# @righteous architecture_suites_DriversImportOnlyTheirOwnPartsDetector
from suites.sample.drivers.writer.rules.writer_rule import WriterRule


# @righteous architecture_suites_DriversInDriverFoldersDetector
class WriterDriver(Driver):
    name = "sample.writer"
    rules = [WriterRule, SharedRule]
