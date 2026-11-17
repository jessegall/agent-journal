from engine.module.module import Module
from tests.unit.engine.samples.program_sample import SampleProgram

PATH = "tests.stories.engine.module.support.sample_programs"


class SecondProgram(SampleProgram):
    """A second program under the sample program's name, for the sync check."""

    title = "Second program"


class SampleProgramModule(Module):
    """Adds the sample program."""

    name = "sample.program"
    requires_engine = ">=7,<8"
    providers = [SampleProgram]


class SecondProgramModule(Module):
    """Adds a second program named sample."""

    name = "second.program"
    requires_engine = ">=7,<8"
    providers = [SecondProgram]
