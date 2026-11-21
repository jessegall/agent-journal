<?php

declare(strict_types=1);

namespace App\Files\Contracts;

use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Files\Values\Depth;
use App\Files\Values\FilePath;
use App\Files\Values\Fingerprint;
use App\Files\Values\FolderEntries;

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

    public function read(FilePath $file): string;

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

    public function isFolder(FilePath $folder): bool;

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
     * Makes the folder and the missing folders above it with the place's mode.
     */
    public function makeFolder(FilePath $folder): void;

    /**
     * The bytes free on the disk that holds the place's root.
     */
    public function freeSpace(Place $place): int;

    /**
     * How often this process opened the file to read it.
     */
    public function readCount(FilePath $file): int;
}
