from core.base.driver.project_paths import ProjectPaths


def test_a_long_path_keeps_only_its_file_name():
    assert ProjectPaths.short_paths("/private/tmp/claude-501/scratchpad/g.txt") == "…/g.txt"
    assert ProjectPaths.short_paths("python3 /private/tmp/claude-501/mv4.py --quiet") == "python3 …/mv4.py --quiet"
    assert ProjectPaths.short_paths("cat src/core/base/driver/tool.py") == "cat …/tool.py"


def test_a_short_path_and_a_link_stay():
    assert ProjectPaths.short_paths("ls build/out") == "ls build/out"
    assert ProjectPaths.short_paths("curl https://example.com/a/b/c") == "curl https://example.com/a/b/c"
