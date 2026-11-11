from engine.text.run_target import RunTarget


def test_one_test_names_its_file_before_the_two_colons():
    target = RunTarget("tests/unit/test_cart.py::test_total")
    assert (target.file, target.is_single_test) == ("tests/unit/test_cart.py", True)


def test_a_test_inside_a_class_still_names_its_file():
    assert RunTarget("tests/unit/test_cart.py::TestCart::test_total").file == "tests/unit/test_cart.py"


def test_a_file_or_a_folder_is_its_own_file_and_no_single_test():
    file, folder = RunTarget("tests/unit/test_cart.py"), RunTarget("tests/unit")
    assert (file.file, file.is_single_test, folder.file, folder.is_single_test) == ("tests/unit/test_cart.py", False, "tests/unit", False)
