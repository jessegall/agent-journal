---
name: DirectFileAccess
description: Reading, listing, stating or writing a file in this project: a file_get_contents, file_put_contents, fopen, glob, scandir, is_file, is_dir, realpath, mkdir, unlink, rename, symlink, tempnam, hash_file or disk_free_space, Laravel's Filesystem or File facade, or Symfony's Finder. Read this before touching the disk, and when a direct-file-access finding points here.
summary: Only app/Files touches the disk; every other file read, list, stat and write goes through App\Contracts\Files.
tier: keep-in-mind
languages: [php]
---

# Only the Files area touches the disk

Every file read, list, stat and write outside `app/Files` goes through `App\Contracts\Files` with a `FilePath`.
The funnel keeps a path inside its place, never follows a link out of it, never enters a closed folder, reads an
unchanged file once per process, walks no deeper than the call asks and refuses a read started inside another read.
`tests/Architecture/DirectFileAccessTest.php` fails on any direct file function outside `app/Files`, and the
`direct-file-access` rule flags each one.

## A path is a place and a path inside it

- `FilePath::in(Place::Project, 'docs/accounts/docker-images.json')`: a place (`Place` in `App\Files\Enums`) and a
  path inside it. A path that climbs with `..`, starts at `/` or holds a NUL byte is refused by name.
- `$files->filePathOf($absolute)`: an absolute path handed in from outside, placed in the open place that holds it.
  A path in a private place is refused with `FolderClosed`.
- `$files->pathIn(Place::Accounts, $folder)`: an absolute path in the place its owner names, private ones included.
- The places are `Project`, `Temporary`, `HostSkills` and `ProcessOutput`, which are open, and `Accounts`,
  `SharingSecrets`, `SharingTunnels` and `HookRuntime`, which are private. Only Profiles and Hooks name `Accounts`,
  only Sharing names the two sharing places, and only Hooks names `HookRuntime` (`PrivatePlaceOwnerTest`).

## Which Files method replaces each function

| Instead of | Use |
|---|---|
| `file_get_contents`, `file`, `readfile`, `fopen` to read | `read`, or `readAtMost($file, $bytes)` for a bounded read |
| `json_decode(file_get_contents(...))` | `readJson`, parsed once while the file is unchanged |
| a `--file` the user names | `readNamed`, `readNamedAtMost` |
| `hash_file`, `md5_file`, `sha1_file` | `digest` (sha256, kept while the file is unchanged) |
| `is_file`, `file_exists`, `is_readable` | `exists` |
| `is_dir` | `isFolder` |
| `is_link` | `isLink` |
| `readlink` | `linkTarget` |
| `stat`, `lstat`, `filemtime`, `filesize`, `fileperms` | `fingerprint` |
| `realpath` | `realPath`, or `filePathOf` for a path handed in |
| `glob`, `scandir`, `opendir`, `DirectoryIterator`, `Finder` | `list($folder, $depth, $pattern)` or `matching($pattern)` |
| a boot reading the project's own code | `codeFolder`, `codeFile`, kept for the process |
| `file_put_contents`, `fopen` to write | `write` (atomic), `create` (only when nothing is there), `append` (under a lock) |
| `mkdir` | `makeFolder($folder, Permissions::Shared)` or `Permissions::OwnerOnly` |
| `chmod` | the `Permissions` a write or `makeFolder` takes: `OwnerOnly` is 0600 from the moment the file appears |
| `unlink` | `delete` (a missing file is no failure) |
| `rmdir`, a recursive removal | `deleteFolder($folder, Depth::levels($n))`, refused when the tree is deeper |
| `symlink` | `link` |
| `rename` | `move` |
| `fopen` with `flock` | `locked($lock, fn () => ...)` |
| `tempnam` | `scratch(fn (FilePath $file) => ..., '.php')`, removed however the work ends |
| `disk_free_space` | `freeSpace(Place::ProcessOutput)` |

## What a caller must know

- **Read once.** An unchanged file is opened once per process; a changed, replaced or freshly written file is read
  again, and the funnel's own write drops the kept copy. A private place's file is never kept.
- **One level by default.** `list` gives the folder's own entries; a deeper walk names its `Depth`, at most 16. A
  `*` in `matching` matches inside one name, and `**` is refused.
- **No read inside a read.** A read, list or walk started while another runs throws `FileReadReentered`; a read
  inside `locked` is allowed.
- **Closed folders.** `.git`, `vendor`, `node_modules`, `.journal/worktrees` and `storage/app/private` are never
  entered from the project; a list leaves them out and a path into one throws `FolderClosed`.

## What stays allowed

- Laravel's Storage disks through `Illuminate\Contracts\Filesystem\Factory`, such as the `process-output` disk.
- Streams already open: `fread`, `fwrite` and `stream_get_contents` on a handle, `php://stdin` and `php://memory`.
- A method the user settled as outside the places, marked `#[OutsideThePlaces(PlaceExemption::...)]`: the classified
  command's own file system, a file the user names, a gateway's program, the host secret file and the host's own
  account folders. Each such site is listed as exempt in `docs/naming/direct-file-access-sites.txt`.
