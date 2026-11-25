<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Projects\FileComments;
use App\Models\Projects\ProjectFile;

/**
 * Project files take no comments: the File window shows no threads and offers no comment.
 */
final readonly class NoFileComments implements FileComments
{
    public function threadsOn(ProjectFile $file, string $digest, array $lines): array
    {
        return [];
    }

    public function commentAddress(): string|null
    {
        return null;
    }

    public function tellAddress(): string|null
    {
        return null;
    }
}
