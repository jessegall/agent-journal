<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Notifications\NotificationChange;
use Carbon\CarbonImmutable;

/**
 * Deletes changes older than a day, two hundred at a time by creation time, so a prune never holds a long lock; a
 * cursor older than what is left takes a fresh snapshot.
 */
final readonly class NotificationChangeRetentionService
{
    public const int BATCH_LIMIT = 200;

    /**
     * @return int how many changes it deleted
     */
    public function prune(CarbonImmutable $now): int
    {
        $before = $now->subHours(NotificationChange::RETAINED_HOURS);
        $deleted = 0;

        do {
            $batch = NotificationChange::query()
                ->withAnyId(NotificationChange::query()
                    ->where('created_at', '<', $before)
                    ->orderBy('created_at')
                    ->limit(self::BATCH_LIMIT)
                    ->select('id'))
                ->delete();

            $deleted += $batch;
        } while ($batch === self::BATCH_LIMIT);

        return $deleted;
    }
}
