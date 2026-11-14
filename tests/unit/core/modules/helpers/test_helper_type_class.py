from pathlib import Path
import re


SOURCE = Path(__file__).resolve().parents[5] / "src"
SAMPLES = "tests.stories.core.modules.helpers.support.helper_type_samples"
WORKER_CLASS = "suites/coding/modules/workers/types/worker.py"
WORKER_ROLE_STRING = re.compile(r"""(==|!=)\s*["']worker["']|["']worker["']\s*(==|!=)|\(\s*["']main["']\s*,\s*["']worker["']""")


def test_no_file_but_the_worker_class_names_the_worker_as_a_role_string():
    naming = sorted(str(path.relative_to(SOURCE)) for path in SOURCE.rglob("*.py")
                    if str(path.relative_to(SOURCE)) != WORKER_CLASS and WORKER_ROLE_STRING.search(path.read_text()))
    assert naming == [], str(naming)
