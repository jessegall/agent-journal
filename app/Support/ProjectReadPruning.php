<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\ProjectReadState;
use App\Models\ProjectRead;
use Carbon\CarbonImmutable;

/**
 * Expires the project reads no host answered in time, and deletes the settled ones once nobody reuses them.
 */
final readonly class ProjectReadPruning
{
    public function prune(CarbonImmutable $now): void
    {
        ProjectRead::query()
            ->where('state', ProjectReadState::Pending->value)
            ->where('expires_at', '<', $now)
            ->update(['state' => ProjectReadState::Expired->value]);

        ProjectRead::query()
            ->where('state', '!=', ProjectReadState::Pending->value)
            ->where('updated_at', '<', $now->subMinutes(ProjectRead::KEEP_MINUTES_LIMIT))
            ->delete();
    }
}
