from pathlib import Path

from migrations.m0010_project_folder import run as gather_project


def run(root: Path) -> str:
    return gather_project(root)
