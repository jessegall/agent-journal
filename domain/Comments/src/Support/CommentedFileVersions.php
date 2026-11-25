<?php

declare(strict_types=1);

namespace Domain\Comments\Support;

use App\Contracts\Projects\HeldFileVersions;
use App\Models\Projects\ProjectFile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * A project file version a comment names is kept: the comment quotes its lines.
 */
final readonly class CommentedFileVersions implements HeldFileVersions
{
    public function leaveOutHeld(Builder $versions): void
    {
        $versions->whereNotExists(fn (QueryBuilder $comments) => $comments->from('comments')
            ->where('comments.target_type', ProjectFile::linkType())
            ->whereColumn('comments.target_id', 'project_file_versions.project_file_id')
            ->whereColumn('comments.version_id', 'project_file_versions.digest'));
    }
}
