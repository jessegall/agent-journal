<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Projects\HeldFileVersions;
use App\Enums\Projects\ProjectReadState;
use App\Models\Projects\ProjectFileVersion;
use App\Models\Projects\ProjectRead;
use Carbon\CarbonImmutable;

/**
 * Expires the project reads no host answered in time, deletes the settled ones once nobody reuses them, and keeps of
 * each project file only the versions something still names and the newest few of the rest.
 */
final readonly class ProjectReadRetentionService
{
    public function __construct(private HeldFileVersions $held) {}

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

        $versions = ProjectFileVersion::query()->pastKeptLimit();
        $this->held->leaveOutHeld($versions);
        $versions->delete();
    }
}
