<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Authorization\OwnerPolicy;
use App\Models\ProjectFile;

/**
 * Only the owner reads a connected project's files and the versions comments point at.
 */
final readonly class ProjectFilesPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return ProjectFile::class;
    }
}
