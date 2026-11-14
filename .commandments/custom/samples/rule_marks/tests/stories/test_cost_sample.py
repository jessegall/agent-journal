import ast
import subprocess
import sys


def interpreter_run():
    # @sin architecture_testing_interpreter_in_a_test
    return subprocess.run([sys.executable, "-c", "pass"], check=False)


def read_platform():
    # @righteous architecture_testing_interpreter_in_a_test
    return sys.platform


def repository_made(folder):
    # @sin architecture_testing_git_init_in_a_test
    return subprocess.run(["git", "-C", folder, "init"], check=False)


def repository_status(folder):
    # @righteous architecture_testing_git_init_in_a_test
    return subprocess.run(["git", "-C", folder, "status"], check=False)


def source_parsed(path):
    # @sin architecture_testing_source_parsed_in_a_test
    return ast.parse(path.read_text())


def parsed_once(path, source_tree):
    # @righteous architecture_testing_source_parsed_in_a_test
    return source_tree(path)


def type_checked():
    # @sin architecture_testing_type_check_in_a_test
    return subprocess.run(["pyright", "src"], check=False)


def listed_files():
    # @righteous architecture_testing_type_check_in_a_test
    return subprocess.run(["ls", "src"], check=False)


def reader_name():
    # @righteous architecture_testing_type_check_in_a_test
    return "pyright"
