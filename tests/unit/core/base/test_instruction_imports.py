from core.base.instruction_imports import InstructionImport, InstructionImports


def test_an_import_named_twice_is_a_fault(tmp_path):
    (tmp_path / "AGENTS.md").write_text("# Rules\n")
    (tmp_path / "CLAUDE.md").write_text("@AGENTS.md\n\nSome words\n@AGENTS.md\n")
    assert InstructionImports(tmp_path).faults() == [InstructionImport("CLAUDE.md", "AGENTS.md", 2, False)]


def test_two_files_that_import_each_other_are_one_fault(tmp_path):
    (tmp_path / "web").mkdir()
    (tmp_path / "web" / "AGENTS.md").write_text("@CLAUDE.md\n")
    (tmp_path / "web" / "CLAUDE.md").write_text("@AGENTS.md\n")
    assert [(fault.file, fault.imported, fault.imports_back) for fault in InstructionImports(tmp_path).faults()] == [("web/AGENTS.md", "CLAUDE.md", True)]


def test_one_import_each_way_down_is_no_fault_and_skipped_folders_are_not_read(tmp_path):
    (tmp_path / "AGENTS.md").write_text("# Rules\n")
    (tmp_path / "CLAUDE.md").write_text("@AGENTS.md\n")
    (tmp_path / "node_modules").mkdir()
    (tmp_path / "node_modules" / "CLAUDE.md").write_text("@AGENTS.md\n@AGENTS.md\n")
    assert InstructionImports(tmp_path).faults() == []


def test_removing_an_import_keeps_its_first_line_or_drops_its_only_one():
    assert InstructionImports.without_import("@AGENTS.md\n\nWords\n@AGENTS.md\n", "AGENTS.md") == "@AGENTS.md\n\nWords\n"
    assert InstructionImports.without_import("# Web\n@CLAUDE.md\n", "CLAUDE.md") == "# Web\n"
