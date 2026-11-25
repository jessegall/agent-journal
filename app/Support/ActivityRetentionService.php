<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Agents\ActivityEntry;

/**
 * Keeps of each environment's activity only its newest entries, up to the kept limit.
 */
final readonly class ActivityRetentionService
{
    public function prune(): void
    {
        ActivityEntry::query()->pastKeptLimit()->delete();
    }
}
