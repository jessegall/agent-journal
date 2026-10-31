import sys


def test_declaring_a_module_imports_none_of_its_guards_or_listeners():
    for name in ("tests.core.base.samples.unused_guard_sample", "tests.core.base.samples.listener_sample", "tests.core.base.samples.module_sample"):
        sys.modules.pop(name, None)
    from tests.core.base.samples.module_sample import ItemsModule
    assert ItemsModule.name == "items"
    assert "tests.core.base.samples.unused_guard_sample" not in sys.modules
    assert "tests.core.base.samples.listener_sample" not in sys.modules
