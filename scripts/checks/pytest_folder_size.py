import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "src"))

from engine.testing.templates.temp_folders import USER_FOLDER_LIMIT_BYTES, TempFolders  # noqa: E402


def main(limit: int) -> int:
    folders = TempFolders()
    size = folders.size()
    print(f"{folders.user_folder} takes {size} bytes, the limit is {limit}")
    return 1 if size > limit else 0


if __name__ == "__main__":
    raise SystemExit(main(int(sys.argv[1]) if len(sys.argv) > 1 else USER_FOLDER_LIMIT_BYTES))
