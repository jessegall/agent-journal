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
        $ranked = ActivityEntry::query()->selectRaw(
            'id, row_number() over (partition by environment_id order by occurred_at desc, id desc) as place',
        );

        ActivityEntry::query()
            ->withAnyId(fn ($pruned) => $pruned->fromSub($ranked, 'ranked')
                ->where('place', '>', ActivityEntry::KEPT_ENTRY_LIMIT)
                ->select('id'))
            ->delete();
    }
}
