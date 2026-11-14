from engine.module.suite_import_check import SuiteImportCheck


def test_a_suite_that_imports_only_contract_areas_keeps_the_contract(tmp_path):
    (tmp_path / "fake_module.py").write_text("from engine.command.command import Command\nfrom engine.model.model import Model\n")
    assert SuiteImportCheck().refusals(tmp_path) == ()


def test_a_suite_importing_an_internal_area_is_refused_with_its_file_and_line(tmp_path):
    (tmp_path / "fake_module.py").write_text("from engine.command.command import Command\nfrom engine.hosting.host import Host\n")
    refusals = SuiteImportCheck().refusals(tmp_path)
    assert [refusal.text for refusal in refusals] == ["fake_module.py:2: imports engine.hosting.host, an internal area of the engine: use its contract areas"]
