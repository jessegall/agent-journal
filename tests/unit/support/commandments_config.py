import json
import subprocess
from pathlib import Path

CONFIG_PATH = Path(".commandments") / "config.json"


def project_root(checkout: Path) -> Path:
    common = subprocess.run(["git", "rev-parse", "--path-format=absolute", "--git-common-dir"], capture_output=True, text=True, cwd=checkout, check=True).stdout.strip()
    return Path(common).parent


def commandments_config(checkout: Path) -> dict:
    return json.loads((project_root(checkout) / CONFIG_PATH).read_text())
