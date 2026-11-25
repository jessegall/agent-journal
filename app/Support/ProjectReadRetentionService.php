<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Projects\ProjectReadState;
use App\Models\Projects\ProjectFileVersion;
use App\Models\Projects\ProjectRead;
use Carbon\CarbonImmutable;

/**
 * Expires the project reads no host answered in time, deletes the settled ones once nobody reuses them, and keeps of
 * each project file only the versions a comment names and the newest few of the rest.
 */
final readonly class ProjectReadRetentionService
{
    public function prune(CarbonImmutable $now): void
    {
        ProjectRead::query()
            ->withState(ProjectReadState::Pending)
            ->expiredAt($now)
            ->update(['state' => ProjectReadState::Expired->value]);

        ProjectRead::query()
            ->settled()
            ->updatedBefore($now->subMinutes(ProjectRead::KEEP_MINUTES_LIMIT))
            ->delete();

        ProjectFileVersion::query()->uncommented()->pastKeptLimit()->delete();
    }
}
