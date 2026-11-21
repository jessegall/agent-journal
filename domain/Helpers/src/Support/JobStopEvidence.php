<?php

declare(strict_types=1);

namespace Domain\Helpers\Support;

use App\Hooks\Values\StopAttemptReference;
use App\Records\Support\RecordIdentity;
use Domain\Helpers\Models\HelperJob;

/**
 * Finds the helper job a Core event about started work names, and how the job refers to the stop attempt behind it.
 */
final class JobStopEvidence
{
    public const string ATTEMPT_PREFIX = 'stop-attempt:';

    /**
     * The open job the work names, locked for its change: none for other work or for a job that already ended.
     *
     * @return list<HelperJob>
     */
    public static function openJobs(RecordIdentity $work): array
    {
        if ($work->type !== HelperJob::LINK_TYPE) {
            return [];
        }

        return array_values(HelperJob::query()
            ->acrossActors()
            ->open()
            ->whereKey($work->id)
            ->lock('for update')
            ->limit(1)
            ->get()
            ->all());
    }

    public static function referenceOf(StopAttemptReference $attempt): string
    {
        return self::ATTEMPT_PREFIX.$attempt->attemptId;
    }
}
