<?php

declare(strict_types=1);

namespace App\Projects\Contracts;

use App\Connections\Data\FileThreadData;
use App\Models\Projects\ProjectFile;

/**
 * The comments the File window shows on a project file, answered by whatever lets files be commented on; with none,
 * the window shows no threads and offers no comment.
 */
interface FileComments
{
    /**
     * The threads on the version of the file shown, grouped by their lines and ordered by their first line.
     *
     * @param  list<string>  $lines
     * @return list<FileThreadData>
     */
    public function threadsOn(ProjectFile $file, string $digest, array $lines): array;

    /**
     * The address that saves a comment on lines of a file, or null when files take no comments.
     */
    public function commentAddress(): string|null;

    /**
     * The address that tells the project's main agent of a comment on a file, or null when files take no comments.
     */
    public function tellAddress(): string|null;
}
