<?php

declare(strict_types=1);

namespace App\Files\Contracts;

use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Files\Values\Depth;
use App\Files\Values\Fingerprint;
use App\Files\Values\FolderEntries;
use App\Values\FilePath;
use Closure;

/**
 * The one way code reads the files of its places: inside the place, never through a link out or a closed folder,
 * an unchanged file read once per process, and no read started inside another.
 */
interface Files
{
    /**
     * The file path of an absolute path given from outside, such as a command's --file, in the open place that
     * holds it; FileOutsidePlaces when no open place does, FolderClosed when a private place does.
     */
    public function filePathOf(string $absolutePath): FilePath;

    /**
     * The file path of an absolute path in the place the caller names, a private place included, as the owner of an
     * account folder hands it over; FileOutsidePlaces when the path does not lie in that place.
     */
    public function pathIn(Place $place, string $absolutePath): FilePath;

    /**
     * The real path of a file or folder inside its place; a link out of the place or a closed folder is refused.
     */
    public function realPath(FilePath $path): string;

    /**
     * The whole text of the file.
     */
    public function read(FilePath $file): string;

    /**
     * A file the user names on the command line: read through its place when an open place holds it, refused with
     * FolderClosed when a private place does, and read as named when it lies outside every place.
     */
    public function readNamed(string $path): string;

    /**
     * At most the given number of bytes of a file the user names, refused and placed as readNamed.
     */
    public function readNamedAtMost(string $path, int $bytes): string;

    /**
     * At most the given number of bytes from the start of the file, never kept.
     */
    public function readAtMost(FilePath $file, int $bytes): string;

    /**
     * The file's JSON decoded, parsed once while the file is unchanged.
     *
     * @return array<array-key, mixed>
     */
    public function readJson(FilePath $file): array;

    /**
     * The sha256 of the file, hashed once while the file is unchanged.
     */
    public function digest(FilePath $file): string;

    /**
     * Whether a file is there, with one stat and no read; a folder answers no.
     */
    public function exists(FilePath $file): bool;

    /**
     * Whether a folder is at the path.
     */
    public function isFolder(FilePath $folder): bool;

    /**
     * Whether the path itself is a link, asked without following it.
     */
    public function isLink(FilePath $path): bool;

    /**
     * Where a link points, in the link's own place; a target outside it is refused without being named.
     */
    public function linkTarget(FilePath $link): FilePath;

    /**
     * The size, change time and digest of the file, to tell whether it changed.
     */
    public function fingerprint(FilePath $file): Fingerprint;

    /**
     * The entries of a folder down to the depth asked, one level unless more is asked, whose names match the
     * pattern; links are listed and never entered, closed folders left out.
     */
    public function list(FilePath $folder, Depth $depth = new Depth(1), string $pattern = '*'): FolderEntries;

    /**
     * The entries a pattern names, each '*' matching within one name.
     */
    public function matching(FilePath $pattern): FolderEntries;

    /**
     * The entries of the project's code a pattern names, listed once per process and kept with no stat afterwards:
     * code cannot change while a process runs.
     */
    public function codeFolder(FilePath $pattern): FolderEntries;

    /**
     * A file of the project's code, read once per process and kept with no stat afterwards.
     */
    public function codeFile(FilePath $file): string;

    /**
     * Replaces the whole file atomically, making missing folders with the place's mode; a reader sees the old file
     * or the new, and a read after the write sees the new.
     */
    public function write(FilePath $file, string $bytes, Permissions $permissions = Permissions::Shared): void;

    /**
     * Creates the file only when none is there; FileExists otherwise, and the old file stays untouched.
     */
    public function create(FilePath $file, string $bytes, Permissions $permissions = Permissions::Shared): void;

    /**
     * Adds a line at the end of the file under an exclusive lock; a new file is its owner's in a private place.
     */
    public function append(FilePath $file, string $line): void;

    /**
     * Makes the folder and the missing folders above it, entered by everyone or by the owner alone, and gives the folder
     * itself exactly that mode.
     */
    public function makeFolder(FilePath $folder, Permissions $permissions): void;

    /**
     * Removes a file or a link, never its target; a missing file is no failure.
     */
    public function delete(FilePath $file): void;

    /**
     * Removes a folder tree no deeper than the depth, refusing a deeper one before anything is removed; links inside
     * are removed as links, never followed.
     */
    public function deleteFolder(FilePath $folder, Depth $depth): void;

    /**
     * Makes a link to a target in the link's own place; a target in another place is refused.
     */
    public function link(FilePath $link, FilePath $target): void;

    /**
     * Renames an entry within its place, replacing what is at the new path in one step.
     */
    public function move(FilePath $from, FilePath $to): void;

    /**
     * Runs the work while holding an exclusive lock on the lock file, released when the work ends or throws; a read
     * inside the work is allowed.
     *
     * @template T
     *
     * @param  Closure(): T  $work
     * @return T
     */
    public function locked(FilePath $lock, Closure $work): mixed;

    /**
     * Runs the work with a new file path in the temporary place, ending in the extension, such as '.php' for a tool
     * that formats only PHP files; the file is removed when the work ends or throws.
     *
     * @template T
     *
     * @param  Closure(FilePath): T  $work
     * @return T
     */
    public function scratch(Closure $work, string $extension = ''): mixed;

    /**
     * The bytes free on the disk that holds the place's root.
     */
    public function freeSpace(Place $place): int;

    /**
     * How often this process opened the file to read it.
     */
    public function readCount(FilePath $file): int;
}
