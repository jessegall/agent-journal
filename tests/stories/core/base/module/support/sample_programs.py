from core.base.module.module import Module
from tests.unit.core.base.samples.program_sample import SampleProgram

PATH = "tests.stories.core.base.module.support.sample_programs"


class SecondProgram(SampleProgram):
    """A second program under the sample program's name, for the sync check."""

    title = "Second program"


class SampleProgramModule(Module):
    """Adds the sample program."""

    name = "sample.program"
    requires_core = ">=5,<6"
    providers = [SampleProgram]


class SecondProgramModule(Module):
    """Adds a second program named sample."""

    name = "second.program"
    requires_core = ">=5,<6"
    providers = [SecondProgram]
