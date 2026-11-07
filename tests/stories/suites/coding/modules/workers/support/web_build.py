import json

from tests.stories.suites.coding.modules.workers.support.dispatch_steps import repository_environment
from tests.stories.suites.coding.modules.workers.support.git_repository import ENVIRONMENT_BRANCH

BUILT_FILE = "app/web/dist/chat.js"
BUILT_TEXT = "rebuilt from merged sources\n"


def build_repository(story):
    repository = repository_environment(story)
    repository.checkout(ENVIRONMENT_BRANCH)
    (repository.folder / "app/web/dist").mkdir(parents=True)
    (repository.folder / "src/viewer").mkdir(parents=True)
    repository.committed("src/viewer/package.json", json.dumps({"scripts": {"build": "node build.cjs"}}), "The web build command")
    script = ('const fs = require("node:fs");\n'
              'const folder = "../../app/web/dist";\n'
              'if (fs.existsSync(folder)) throw new Error("old build was not removed");\n'
              'fs.mkdirSync(folder, { recursive: true });\n'
              f'fs.writeFileSync(folder + "/chat.js", {json.dumps(BUILT_TEXT)});\n')
    repository.committed("src/viewer/build.cjs", script, "Build the web files")
    repository.committed(BUILT_FILE, "const total = 1;\n" * 30, "The first web build")
    return repository
