import ast
import subprocess
import sys


def interpreter_run():
    # @sin architecture_testing_NoInterpreterInATestDetector
    return subprocess.run([sys.executable, "-c", "pass"], check=False)


def read_platform():
    # @righteous architecture_testing_NoInterpreterInATestDetector
    return sys.platform


def repository_made(folder):
    # @sin architecture_testing_NoGitInitInATestDetector
    return subprocess.run(["git", "-C", folder, "init"], check=False)


def repository_status(folder):
    # @righteous architecture_testing_NoGitInitInATestDetector
    return subprocess.run(["git", "-C", folder, "status"], check=False)


def source_parsed(path):
    # @sin architecture_testing_SourceParsedOnceDetector
    return ast.parse(path.read_text())


def parsed_once(path, source_tree):
    # @righteous architecture_testing_SourceParsedOnceDetector
    return source_tree(path)


def type_checked():
    # @sin architecture_testing_TypeCheckInItsOwnJobDetector
    return subprocess.run(["pyright", "src"], check=False)


def listed_files():
    # @righteous architecture_testing_TypeCheckInItsOwnJobDetector
    return subprocess.run(["ls", "src"], check=False)


def reader_name():
    # @righteous architecture_testing_TypeCheckInItsOwnJobDetector
    return "pyright"
