from core.base.module.module import Module
from tests.unit.core.base.samples.program_sample import SampleProgram

PATH = "tests.stories.core.base.module.support.sample_programs"


class TwinProgram(SampleProgram):
    """A second program under the sample program's name."""

    title = "Twin program"


class SampleProgramModule(Module):
    """Adds the sample program."""

    name = "sample.program"
    requires_core = ">=5,<6"
    providers = [SampleProgram]


class TwinProgramModule(Module):
    """Adds a second program named sample."""

    name = "twin.program"
    requires_core = ">=5,<6"
    providers = [TwinProgram]
