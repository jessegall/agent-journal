<?php

declare(strict_types=1);

namespace App\Files\Contracts;

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
     * The bytes free on the disk that holds the place's root.
     */
    public function freeSpace(Place $place): int;

    /**
     * How often this process opened the file to read it.
     */
    public function readCount(FilePath $file): int;
}
