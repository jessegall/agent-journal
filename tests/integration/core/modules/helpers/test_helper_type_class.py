from pathlib import Path
import re


SOURCE = Path(__file__).resolve().parents[5] / "src"
SAMPLES = "tests.stories.core.modules.helpers.support.helper_type_samples"
WORKER_CLASS = "suites/coding/modules/workers/types/worker.py"
WORKER_ROLE_STRING = re.compile(r"""(==|!=)\s*["']worker["']|["']worker["']\s*(==|!=)|\(\s*["']main["']\s*,\s*["']worker["']""")


def test_a_helper_type_without_a_label_stops_the_boot_naming_the_type_and_the_field(journal):
    journal.expect_sync_refusal(f"{SAMPLES}:UnlabelledScribeSuite", "helper type scribe has no label")
