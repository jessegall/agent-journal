<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Projects\HeldFileVersions;
use Illuminate\Database\Eloquent\Builder;

/**
 * Nothing names a project file version, so pruning keeps only the newest few of each file.
 */
final readonly class NoHeldFileVersions implements HeldFileVersions
{
    public function leaveOutHeld(Builder $versions): void {}
}
