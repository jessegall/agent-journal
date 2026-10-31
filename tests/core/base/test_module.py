import sys


def test_declaring_a_module_imports_none_of_its_guards_or_listeners():
    for name in ("tests.core.base.unused_guard_sample", "tests.core.base.listener_sample", "tests.core.base.module_sample"):
        sys.modules.pop(name, None)
    from tests.core.base.module_sample import LoansModule
    assert LoansModule.name == "loans"
    assert "tests.core.base.unused_guard_sample" not in sys.modules
    assert "tests.core.base.listener_sample" not in sys.modules
