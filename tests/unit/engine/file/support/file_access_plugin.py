from collections.abc import Callable

from mypy.plugin import FunctionContext, MethodContext, Plugin
from mypy.types import Type

FILE_ACCESS = "engine.file.file_access"
PATH_CLASSES = ("pathlib.Path", "pathlib._local.Path", "pathlib._abc.PathBase", "pathlib.types._ReadablePath", "pathlib.types._WritablePath")
PATH_METHODS = (
    "exists", "is_file", "is_dir", "is_symlink", "mkdir", "glob", "rglob", "iterdir", "unlink", "rmdir", "symlink_to",
    "readlink", "read_text", "read_bytes", "write_text", "write_bytes", "touch", "stat", "lstat", "samefile", "chmod",
    "walk", "rename", "replace", "open", "hardlink_to", "is_mount", "owner", "group", "copy", "copy_into", "move", "move_into",
    "is_junction",
)
FUNCTIONS = (
    "builtins.open", "io.open", "shutil.rmtree", "shutil.move", "shutil.copy", "shutil.copy2", "shutil.copyfile",
    "shutil.copytree", "shutil.copymode", "shutil.copystat", "os.walk", "os.fwalk", "os.listdir", "os.scandir", "os.remove",
    "os.unlink", "os.rename", "os.renames", "os.replace", "os.makedirs", "os.mkdir", "os.rmdir", "os.removedirs", "os.stat",
    "os.lstat", "os.open", "os.chmod", "os.symlink", "os.link", "os.readlink", "os.truncate", "os.utime",
    "genericpath.exists", "genericpath.isfile", "genericpath.isdir", "genericpath.getsize", "genericpath.getmtime",
    "posixpath.islink", "posixpath.lexists", "os.path.exists", "os.path.isfile", "os.path.isdir",
    "os.path.islink", "os.path.lexists", "os.path.getsize", "os.path.getmtime", "glob.glob", "glob.iglob",
    "tempfile.NamedTemporaryFile", "tempfile.TemporaryFile", "tempfile.mkstemp", "tempfile.mkdtemp", "tempfile.TemporaryDirectory",
)
REPORTED = {f"{path_class}.{method}" for path_class in PATH_CLASSES for method in PATH_METHODS} | set(FUNCTIONS)


class FileAccessPlugin(Plugin):
    """A mypy plugin that marks every call reaching the file system from a module other than FileAccess."""

    def get_method_hook(self, fullname: str) -> Callable[[MethodContext], Type] | None:
        return self.reported if fullname in REPORTED else None

    def get_function_hook(self, fullname: str) -> Callable[[FunctionContext], Type] | None:
        return self.reported if fullname in REPORTED else None

    def reported(self, context: MethodContext | FunctionContext) -> Type:
        if context.api.modules and getattr(context.api, "tree", None) is not None and context.api.tree.fullname != FILE_ACCESS:
            context.api.fail("file-access-bypass", context.context)
        return context.default_return_type


def plugin(version: str) -> type[Plugin]:
    return FileAccessPlugin
