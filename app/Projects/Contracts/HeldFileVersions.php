<?php

declare(strict_types=1);

namespace App\Projects\Contracts;

use App\Models\Projects\ProjectFileVersion;
use Illuminate\Database\Eloquent\Builder;

/**
 * The project file versions something still names, which pruning keeps; with nothing naming them, pruning keeps only
 * the newest few.
 */
interface HeldFileVersions
{
    /**
     * Leaves the held versions out of the versions to prune.
     *
     * @param  Builder<ProjectFileVersion>  $versions
     */
    public function leaveOutHeld(Builder $versions): void;
}
